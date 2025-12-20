# DS-FoodService Frontend Specification

## 1. Project Overview
This project is a React-based frontend application for the Duksung Food Service platform. It allows users to browse on-campus and off-campus restaurants, view menus, read/write reviews, and manage favorites. The application integrates with a backend API and uses Kakao Maps for location services.

## 2. Tech Stack

### Core Frameworks & Libraries
- **Language**: JavaScript (ES Modules)
- **Framework**: [React](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Styling
- **CSS Framework**: [TailwindCSS](https://tailwindcss.com/)
- **PostCSS**: For processing CSS

### External APIs
- **Maps**: Kakao Maps SDK

## 3. Directory Structure

```
src/
├── api/                # API client and endpoint definitions
│   ├── client.js       # Axios instance setup
│   └── endpoints.js    # API URL constants
├── data/               # Static data assets
├── AuthContext.jsx     # Authentication and global state context
├── App.jsx             # Main application component & Routing
├── Layout.jsx          # Header and Footer layout components
├── Homepage.jsx        # Landing page
├── MenuPage.jsx        # On-campus cafeteria menus
├── OffCampusPage.jsx   # Off-campus restaurant recommendations
├── DetailPage.jsx      # Restaurant detail view
├── MyReviews.jsx       # User's review management page
├── Signin.jsx          # User registration
├── login.jsx           # User login
└── ...components       # Reusable UI components (RestaurantCard, ReviewForm, etc.)
```

## 4. Key Features

### 4.1. Authentication
- **Login/Signup**: Email and password-based authentication.
- **Token Management**: JWT tokens stored in `localStorage` for persistent sessions.
- **Protected Routes**: Logic to check authentication status before allowing actions like "Review" or "Favorite".

### 4.2. Restaurant Discovery
- **On-Campus (`/menu`)**:
  - Displays school cafeteria menus.
  - Filtering options: Vegan, Halal, Gluten-Free, etc.
  - Search functionality by restaurant name or menu item.
- **Off-Campus (`/offcampus`)**:
  - Recommendations for restaurants near the campus.
  - Integration with Kakao Maps to show locations.

### 4.3. Reviews & Ratings
- Users can write reviews for restaurants.
- View list of reviews for specific restaurants.
- "My Reviews" page to manage one's own reviews.

### 4.4. Favorites (Bookmarks)
- functionalities to toggle "Favorite" status on restaurants.
- Favorites persist across sessions via API.

## 5. API Integration
The application communicates with a backend server. Key endpoints used include:
- `/auth/login`: User Sign in
- `/auth/signup`: User Registration
- `/api/bookmark`: Toggle favorites
- `FAV_LIST`: Retrieve user's favorite restaurants
- `REVIEWS_LIST`: Get reviews for a restaurant

## 6. Layout & Design
- **Responsive Design**: Built with TailwindCSS to support mobile and desktop views.
- **Common Layout**: Header and Footer defined in `Layout.jsx` wrap the main content.
