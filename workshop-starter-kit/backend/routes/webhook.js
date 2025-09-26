const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { updateAttendeePaymentStatus, updatePaymentStatus, getPaymentByStripeId } = require('../db');
const { sendConfirmationEmail, sendReminderEmail } = require('./email');

const router = express.Router();

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful checkout session
async function handleCheckoutSessionCompleted(session) {
  try {
    const { workshopId, attendeeId } = session.metadata;
    
    // Update attendee payment status
    await updateAttendeePaymentStatus(attendeeId, 'completed', session.payment_intent);
    
    // Update payment status
    const payment = await getPaymentByStripeId(session.payment_intent);
    if (payment) {
      await updatePaymentStatus(payment.id, 'succeeded');
    }
    
    // Send confirmation email
    await sendConfirmationEmail({
      attendeeId,
      workshopId,
      attendeeEmail: session.customer_email,
      workshopTitle: session.display_items?.[0]?.custom?.name || 'Workshop'
    });
    
    console.log(`Checkout completed for attendee ${attendeeId} in workshop ${workshopId}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const payment = await getPaymentByStripeId(paymentIntent.id);
    if (payment) {
      await updatePaymentStatus(payment.id, 'succeeded');
      console.log(`Payment succeeded for payment ${payment.id}`);
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const payment = await getPaymentByStripeId(paymentIntent.id);
    if (payment) {
      await updatePaymentStatus(payment.id, 'failed');
      console.log(`Payment failed for payment ${payment.id}`);
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    // Handle subscription or recurring payment logic here
    console.log(`Invoice payment succeeded: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

// Manual webhook testing endpoint
router.post('/test-webhook', async (req, res) => {
  try {
    const { eventType, data } = req.body;
    
    // Simulate webhook event
    const mockEvent = {
      type: eventType,
      data: { object: data }
    };
    
    switch (eventType) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(data);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(data);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported event type' });
    }
    
    res.json({ success: true, message: 'Webhook test completed' });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ error: 'Test webhook failed' });
  }
});

module.exports = router;
