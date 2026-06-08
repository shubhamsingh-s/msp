// Google Analytics 4 Unified Event Tracking System
// Measurement ID can be updated by setting GA_MEASUREMENT_ID or changing it below.
const GA_MEASUREMENT_ID = window.GA_MEASUREMENT_ID || 'G-D7B9VJ4F6S'; 

(function () {
  // Load GA4 script dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  
  gtag('js', new Date());
  
  // Expose configuration (automatic page views)
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure'
  });
})();

// Custom Interaction Trackers
function trackProductView(productId, productName) {
  if (typeof gtag === 'function') {
    gtag('event', 'view_item', {
      items: [{
        item_id: productId,
        item_name: productName
      }]
    });
  }
}

function trackWhatsAppClick(productName, quantity) {
  if (typeof gtag === 'function') {
    gtag('event', 'contact_whatsapp', {
      product_name: productName,
      quantity: quantity
    });
  }
}

function trackCartAddition(productId, productName, category, quantity) {
  if (typeof gtag === 'function') {
    gtag('event', 'add_to_cart', {
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        quantity: quantity
      }]
    });
  }
}

function trackEnquirySubmitted(totalItems, enquiryId) {
  if (typeof gtag === 'function') {
    gtag('event', 'submit_enquiry', {
      enquiry_id: enquiryId,
      total_items: totalItems
    });
  }
}

function trackAdminActivity(action, details = {}) {
  if (typeof gtag === 'function') {
    gtag('event', 'admin_activity', {
      admin_action: action,
      details: JSON.stringify(details)
    });
  }
}

// Global exposure
window.trackProductView = trackProductView;
window.trackWhatsAppClick = trackWhatsAppClick;
window.trackCartAddition = trackCartAddition;
window.trackEnquirySubmitted = trackEnquirySubmitted;
window.trackAdminActivity = trackAdminActivity;
