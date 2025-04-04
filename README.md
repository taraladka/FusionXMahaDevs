# Fusion Technical Club Website

A modern website for the Fusion College Technical Club featuring:

- Responsive design for all devices
- Authentication system (login/signup)
- Events browsing with search and filter functionality
- Contact form with feedback submission
- Information about the club

## Features

- **Home Page**: Showcases club information, upcoming events, and navigation
- **Events Page**: Displays club events with search and filter options
- **Contact Page**: Provides contact information and a feedback form
- **Authentication**: Login/signup functionality to access restricted features

## Prerequisites

- Node.js 18+ and npm/yarn

## Getting Started

1. Extract the project files to your desired location.

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Technology Stack

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Formik & Yup**: Form handling and validation
- **React Icons**: Icon library
- **Firebase**: Authentication and analytics

## Project Structure

- `/app`: Next.js app directory containing pages and components
- `/app/components`: Reusable UI components
- `/app/context`: React context providers
- `/pictures`: Images and assets for the website

## Production Deployment

Build the application for production:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm run start
# or
yarn start
```

## License

MIT 