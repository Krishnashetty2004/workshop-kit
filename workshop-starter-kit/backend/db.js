const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, 'workshop.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Workshops table
      db.run(`
        CREATE TABLE IF NOT EXISTS workshops (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          instructor_name TEXT,
          instructor_bio TEXT,
          date TEXT,
          time TEXT,
          duration TEXT,
          price REAL,
          currency TEXT DEFAULT 'USD',
          max_attendees INTEGER,
          category TEXT,
          skills TEXT,
          agenda TEXT,
          testimonials TEXT,
          faq TEXT,
          theme TEXT,
          status TEXT DEFAULT 'draft',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Attendees table
      db.run(`
        CREATE TABLE IF NOT EXISTS attendees (
          id TEXT PRIMARY KEY,
          workshop_id TEXT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          payment_status TEXT DEFAULT 'pending',
          payment_id TEXT,
          stripe_customer_id TEXT,
          registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workshop_id) REFERENCES workshops (id)
        )
      `);

      // Payments table
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          workshop_id TEXT,
          attendee_id TEXT,
          stripe_payment_intent_id TEXT,
          amount REAL,
          currency TEXT DEFAULT 'USD',
          status TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workshop_id) REFERENCES workshops (id),
          FOREIGN KEY (attendee_id) REFERENCES attendees (id)
        )
      `);

      // Email logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS email_logs (
          id TEXT PRIMARY KEY,
          attendee_id TEXT,
          email_type TEXT,
          status TEXT,
          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (attendee_id) REFERENCES attendees (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

// Database helper functions
const dbHelpers = {
  // Workshop operations
  createWorkshop: (workshop) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO workshops (
          id, title, description, instructor_name, instructor_bio,
          date, time, duration, price, currency, max_attendees,
          category, skills, agenda, testimonials, faq, theme, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        workshop.id,
        workshop.title,
        workshop.description,
        workshop.instructor.name,
        workshop.instructor.bio,
        workshop.date,
        workshop.time,
        workshop.duration,
        workshop.price,
        workshop.currency,
        workshop.maxAttendees,
        workshop.category,
        JSON.stringify(workshop.skills),
        JSON.stringify(workshop.agenda),
        JSON.stringify(workshop.testimonials),
        JSON.stringify(workshop.faq),
        JSON.stringify(workshop.theme),
        workshop.status
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: workshop.id, changes: this.changes });
        }
      });
      
      stmt.finalize();
    });
  },

  getWorkshop: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM workshops WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          // Parse JSON fields
          row.skills = JSON.parse(row.skills || '[]');
          row.agenda = JSON.parse(row.agenda || '[]');
          row.testimonials = JSON.parse(row.testimonials || '[]');
          row.faq = JSON.parse(row.faq || '[]');
          row.theme = JSON.parse(row.theme || '{}');
          resolve(row);
        } else {
          resolve(null);
        }
      });
    });
  },

  getAllWorkshops: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM workshops ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const workshops = rows.map(row => {
            row.skills = JSON.parse(row.skills || '[]');
            row.agenda = JSON.parse(row.agenda || '[]');
            row.testimonials = JSON.parse(row.testimonials || '[]');
            row.faq = JSON.parse(row.faq || '[]');
            row.theme = JSON.parse(row.theme || '{}');
            return row;
          });
          resolve(workshops);
        }
      });
    });
  },

  updateWorkshopStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE workshops SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  },

  // Attendee operations
  createAttendee: (attendee) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO attendees (
          id, workshop_id, name, email, payment_status, payment_id, stripe_customer_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        attendee.id,
        attendee.workshopId,
        attendee.name,
        attendee.email,
        attendee.paymentStatus,
        attendee.paymentId,
        attendee.stripeCustomerId
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: attendee.id, changes: this.changes });
        }
      });
      
      stmt.finalize();
    });
  },

  getAttendeesByWorkshop: (workshopId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM attendees WHERE workshop_id = ? ORDER BY registered_at DESC',
        [workshopId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },

  updateAttendeePaymentStatus: (id, status, paymentId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE attendees SET payment_status = ?, payment_id = ? WHERE id = ?',
        [status, paymentId, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  },

  // Payment operations
  createPayment: (payment) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO payments (
          id, workshop_id, attendee_id, stripe_payment_intent_id, amount, currency, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        payment.id,
        payment.workshopId,
        payment.attendeeId,
        payment.stripePaymentIntentId,
        payment.amount,
        payment.currency,
        payment.status
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: payment.id, changes: this.changes });
        }
      });
      
      stmt.finalize();
    });
  },

  getPaymentByStripeId: (stripePaymentIntentId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM payments WHERE stripe_payment_intent_id = ?',
        [stripePaymentIntentId],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  updatePaymentStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE payments SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  },

  // Analytics
  getWorkshopStats: (workshopId) => {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(a.id) as total_attendees,
          COUNT(CASE WHEN a.payment_status = 'completed' THEN 1 END) as paid_attendees,
          SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) as total_revenue
        FROM attendees a
        LEFT JOIN payments p ON a.id = p.attendee_id
        WHERE a.workshop_id = ?
      `, [workshopId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
};

module.exports = {
  db,
  initDatabase,
  ...dbHelpers
};
