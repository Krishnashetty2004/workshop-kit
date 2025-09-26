const { v4: uuidv4 } = require('uuid');

class Attendee {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.workshopId = data.workshopId;
    this.name = data.name;
    this.email = data.email;
    this.paymentStatus = data.paymentStatus || 'pending';
    this.paymentId = data.paymentId || null;
    this.stripeCustomerId = data.stripeCustomerId || null;
    this.registeredAt = data.registeredAt || new Date().toISOString();
  }

  // Validation methods
  validate() {
    const errors = [];
    
    if (!this.workshopId) {
      errors.push('Workshop ID is required');
    }
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }
    
    if (!['pending', 'completed', 'failed', 'refunded'].includes(this.paymentStatus)) {
      errors.push('Invalid payment status');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Serialization methods
  toJSON() {
    return {
      id: this.id,
      workshopId: this.workshopId,
      name: this.name,
      email: this.email,
      paymentStatus: this.paymentStatus,
      paymentId: this.paymentId,
      stripeCustomerId: this.stripeCustomerId,
      registeredAt: this.registeredAt
    };
  }

  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      paymentStatus: this.paymentStatus,
      registeredAt: this.registeredAt
    };
  }

  // Business logic methods
  isPaid() {
    return this.paymentStatus === 'completed';
  }

  canCancel() {
    return this.paymentStatus === 'completed' || this.paymentStatus === 'pending';
  }

  canRefund() {
    return this.paymentStatus === 'completed';
  }

  // Update methods
  updatePaymentStatus(status, paymentId = null) {
    this.paymentStatus = status;
    if (paymentId) {
      this.paymentId = paymentId;
    }
    return this;
  }

  updateStripeCustomerId(customerId) {
    this.stripeCustomerId = customerId;
    return this;
  }

  // Static factory methods
  static fromDatabase(row) {
    return new Attendee({
      id: row.id,
      workshopId: row.workshop_id,
      name: row.name,
      email: row.email,
      paymentStatus: row.payment_status,
      paymentId: row.payment_id,
      stripeCustomerId: row.stripe_customer_id,
      registeredAt: row.registered_at
    });
  }

  static createFromRegistration(workshopId, registrationData) {
    return new Attendee({
      workshopId,
      name: registrationData.name,
      email: registrationData.email,
      paymentStatus: 'pending'
    });
  }

  // Static utility methods
  static validateRegistrationData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email is required');
    }
    
    if (data.name && data.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }
    
    if (data.email && data.email.length > 255) {
      errors.push('Email must be less than 255 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getPaymentStatusDisplay(status) {
    const statusMap = {
      'pending': 'Pending Payment',
      'completed': 'Paid',
      'failed': 'Payment Failed',
      'refunded': 'Refunded'
    };
    
    return statusMap[status] || 'Unknown';
  }

  static getPaymentStatusColor(status) {
    const colorMap = {
      'pending': 'yellow',
      'completed': 'green',
      'failed': 'red',
      'refunded': 'gray'
    };
    
    return colorMap[status] || 'gray';
  }
}

module.exports = Attendee;
