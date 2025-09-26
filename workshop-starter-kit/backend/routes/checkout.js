const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const { getWorkshop, createAttendee, createPayment, updateAttendeePaymentStatus } = require('../db');

const router = express.Router();

// Create Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { workshopId, attendeeData } = req.body;
    
    // Validate required fields
    if (!workshopId || !attendeeData?.name || !attendeeData?.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: workshopId, name, email'
      });
    }

    // Get workshop details
    const workshop = await getWorkshop(workshopId);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    // Check if workshop is published
    if (workshop.status !== 'published') {
      return res.status(400).json({
        success: false,
        error: 'Workshop is not available for registration'
      });
    }

    // Check capacity
    const attendees = await getAttendeesByWorkshop(workshopId);
    if (attendees.length >= workshop.max_attendees) {
      return res.status(400).json({
        success: false,
        error: 'Workshop is full'
      });
    }

    // Create attendee record
    const attendeeId = uuidv4();
    const attendee = {
      id: attendeeId,
      workshopId,
      name: attendeeData.name,
      email: attendeeData.email,
      paymentStatus: 'pending',
      paymentId: null,
      stripeCustomerId: null
    };

    await createAttendee(attendee);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: workshop.currency.toLowerCase(),
            product_data: {
              name: workshop.title,
              description: workshop.description,
            },
            unit_amount: Math.round(workshop.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?workshop_id=${workshopId}`,
      customer_email: attendeeData.email,
      metadata: {
        workshopId,
        attendeeId,
      },
    });

    // Store payment intent
    const paymentId = uuidv4();
    await createPayment({
      id: paymentId,
      workshopId,
      attendeeId,
      stripePaymentIntentId: session.payment_intent,
      amount: workshop.price,
      currency: workshop.currency,
      status: 'pending'
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
});

// Get checkout session status
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        currency: session.currency
      }
    });

  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session'
    });
  }
});

// Get workshop attendees
router.get('/workshops/:workshopId/attendees', async (req, res) => {
  try {
    const { workshopId } = req.params;
    
    const attendees = await getAttendeesByWorkshop(workshopId);
    
    res.json({
      success: true,
      attendees
    });

  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get attendees'
    });
  }
});

module.exports = router;
