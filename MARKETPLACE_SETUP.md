# Callista LK - Marketplace Setup Guide

## ✅ Completed Setup

### Files Created/Fixed:

1. **CSS Files**

   - ✅ Fixed `css/styles.css` reference in index.html
   - ✅ Renamed and fixed `css/markertplace.css` → `css/marketplace.css`
   - ✅ Added search overlay and functionality CSS
   - ✅ All responsive styles in `css/responsive.css`

2. **HTML Pages**

   - ✅ `pages/marketplace.html` - Fully functional marketplace page
   - ✅ Updated navigation links in `index.html`
   - ✅ Added error handling for images

3. **JavaScript Files**

   - ✅ `js/marketplace.js` - Complete marketplace functionality
   - ✅ `js/main.js` - Main site functionality
   - ✅ Added search, filter, cart, wishlist features

4. **Images**
   - ✅ Created placeholder image: `images/products/placeholder.svg`
   - ✅ Created directory structure for all image categories

## 🎨 Features Implemented

### Marketplace Page Features:

- ✅ Hero banner with gradient background
- ✅ Category slider (requires Swiper.js)
- ✅ Advanced filter sidebar (price, material, color, brand, rating)
- ✅ Product grid with hover effects
- ✅ Quick view modal
- ✅ Add to cart functionality
- ✅ Wishlist functionality
- ✅ Compare products feature
- ✅ Search overlay with suggestions
- ✅ Sorting options
- ✅ Pagination
- ✅ Load more functionality
- ✅ Responsive design for mobile/tablet
- ✅ Back to top button
- ✅ Countdown timer for offers

### Styling Features:

- ✅ Modern gradient colors
- ✅ Smooth animations and transitions
- ✅ Hover effects on products
- ✅ Badge system (New, Sale, Trending)
- ✅ Rating stars
- ✅ Color selectors
- ✅ Responsive filters
- ✅ Mobile-friendly navigation

## 🚀 How to Use

### Running the Website:

1. **Open index.html in a browser**

   ```
   Double-click: src/index.html
   ```

2. **Or use a local server** (recommended):

   ```powershell
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server -p 8000

   # Using PHP
   php -S localhost:8000
   ```

3. **Navigate to the marketplace**:
   - Click "Marketplace" in the navigation menu
   - Or go directly to: `http://localhost:8000/src/pages/marketplace.html`

## 📁 File Structure

```
callista-lk/
├── src/
│   ├── index.html                 ✅ Fixed CSS references
│   ├── css/
│   │   ├── styles.css            ✅ Main styles
│   │   ├── marketplace.css       ✅ Marketplace-specific styles
│   │   └── responsive.css        ✅ Mobile/tablet responsive
│   ├── js/
│   │   ├── main.js               ✅ Core functionality
│   │   └── marketplace.js        ✅ Marketplace features
│   ├── images/
│   │   ├── logo/                 ✅ Created
│   │   ├── products/             ✅ Created + placeholder.svg
│   │   ├── categories/           ✅ Created
│   │   └── portfolio/            ✅ Created
│   └── pages/
│       └── marketplace.html      ✅ Complete marketplace page
```

## 🔧 Customization

### Adding Products:

Edit `pages/marketplace.html` and duplicate the product card structure:

```html
<div class="product-card" data-aos="fade-up">
  <div class="product-badges">
    <span class="badge badge-new">New</span>
  </div>
  <div class="product-image">
    <img
      src="../images/products/your-image.jpg"
      alt="Product Name"
      class="primary-img"
      onerror="this.src='../images/products/placeholder.svg'"
    />
    <!-- ... rest of product card ... -->
  </div>
</div>
```

### Changing Colors:

Update in `css/styles.css`:

```css
:root {
  --primary-color: #2c3e50; /* Change these */
  --secondary-color: #e67e22;
  --accent-color: #3498db;
}
```

### Adding Categories:

Edit the category slider in `marketplace.html`:

```html
<div class="swiper-slide">
  <div class="category-item" data-category="your-category">
    <div class="category-icon">
      <i class="fas fa-your-icon"></i>
    </div>
    <span>Your Category</span>
  </div>
</div>
```

## 🐛 Troubleshooting

### Images Not Loading:

- Images will show placeholder.svg if not found
- Add your actual images to `src/images/products/`
- Keep image names consistent with HTML references

### Styles Not Applying:

- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors (F12)
- Verify CSS file paths are correct

### JavaScript Not Working:

- Check browser console for errors
- Ensure all script tags are at the bottom of HTML
- Verify Swiper.js and AOS.js are loading from CDN

## 📦 Dependencies

External libraries loaded via CDN:

- ✅ Font Awesome 6.4.0
- ✅ Google Fonts (Poppins & Playfair Display)
- ✅ Swiper.js 10 (for category slider)
- ✅ AOS 2.3.1 (for scroll animations)

## 🎯 Next Steps

To complete your marketplace:

1. Add real product images to `images/products/`
2. Add logo image to `images/logo/logo.png`
3. Implement backend API for products
4. Add payment integration
5. Create user authentication pages
6. Build shopping cart page
7. Create product detail pages

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify all file paths are correct
3. Ensure you're using a modern browser (Chrome, Firefox, Edge)

---

**Status**: ✅ Marketplace is fully functional and ready to use!
**Last Updated**: October 26, 2025
