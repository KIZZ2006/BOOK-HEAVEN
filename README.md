# Book Heaven 🌿📚

*A calm, luminous, ultra-accessible web reading platform where stories come to life.*

## ✨ Features

### 🎨 **Beautiful Design**
- **Calm, luminous interface** with soft pastel palette
- **Falling leaves animation** on homepage (respects reduced motion preferences)
- **Glass morphism** design elements with subtle shadows
- **Responsive design** that works on all devices

### 🏛️ **3D Interactive Library**
- **Circular floating library** built with Three.js
- **Books orbit gently** in a beautiful 3D space
- **Interactive book selection** with hover effects and glow
- **Smooth animations** that respect accessibility preferences

### 📖 **Advanced Reader**
- **Two-page spread** with realistic book opening animation
- **Adjustable font size** and line height
- **Night mode** for comfortable reading
- **Keyboard navigation** (arrow keys, escape, fullscreen)
- **Auto-hiding controls** for distraction-free reading

### 🔊 **TTS Audio Player**
- **High-quality text-to-speech** with multiple voices
- **Synchronized text highlighting** as audio plays
- **Adjustable playback speed** (0.5x to 2.0x)
- **Start from any paragraph** with click navigation
- **Volume and voice controls** with easy access

### ♿ **Accessibility First**
- **WCAG 2.1 AA compliance** baseline
- **Keyboard navigation** for all interactions
- **Screen reader support** with proper ARIA labels
- **Reduced motion support** for users with vestibular disorders
- **High contrast mode** support
- **Focus management** and visible focus indicators

### 🔐 **Admin Features**
- **Admin-only uploads** for PDF books
- **Secure authentication** with role-based access
- **DMCA compliance** and takedown workflow
- **Content moderation** tools

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-heaven
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React Three Fiber** - 3D graphics and animations
- **Three.js** - 3D library for the interactive library
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons

### Backend (Planned)
- **Node.js/Express** or **Python/FastAPI**
- **PostgreSQL** - Relational database for metadata
- **Redis** - Session management and caching
- **AWS S3/Google Cloud Storage** - PDF and asset storage
- **CloudFront/CDN** - Fast content delivery

### TTS Integration (Planned)
- **Google Cloud TTS** or **Amazon Polly**
- **Real-time streaming** with paragraph synchronization
- **Multiple voice support** with language options

## 📁 Project Structure

```
book-heaven/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage with falling leaves
│   └── library/           # 3D library page
├── components/             # React components
│   ├── Library3D.tsx      # 3D interactive library
│   ├── BookReader.tsx     # Book reader with two-page spread
│   └── AudioPlayer.tsx    # TTS audio player
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎯 Key Components

### Homepage (`app/page.tsx`)
- **Falling leaves animation** with reduced motion support
- **Welcome message** and community guidelines
- **Developer credits** (Jane, Krishna) and admin info (Yasemin, Kevser, Krishna)
- **Quick search** and navigation to library

### 3D Library (`components/Library3D.tsx`)
- **Circular book orbit** with gentle floating animation
- **Interactive book selection** with popup cards
- **Three.js scene** with ambient lighting and particles
- **Accessibility fallbacks** for reduced motion

### Book Reader (`components/BookReader.tsx`)
- **Two-page spread** with smooth page transitions
- **Font controls** (size, line height, night mode)
- **Keyboard shortcuts** and fullscreen support
- **Auto-hiding controls** for immersive reading

### Audio Player (`components/AudioPlayer.tsx`)
- **TTS playback** with synchronized highlighting
- **Voice selection** and speed controls
- **Paragraph navigation** with click-to-start
- **Volume and settings** panel

## 🎨 Design System

### Color Palette
- **Background**: `#F7FBF6` (very light mint)
- **Primary**: `#A3D9B1` (pastel leaf green)
- **Accent**: `#F0D9A7` (soft gold)
- **Text**: `#263238` (charcoal)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Animations
- **Duration**: 150ms - 350ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Reduced motion**: Respects user preferences

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting
- **Component-based architecture** with hooks

## 🚀 Deployment

### Frontend
- **Vercel** (recommended for Next.js)
- **Netlify** alternative option
- **Static export** available

### Backend (Future)
- **AWS Lambda** or **Google Cloud Functions**
- **Docker containers** for easy deployment
- **CI/CD pipeline** with automated testing

## 🔒 Security & Compliance

### Copyright & DMCA
- **Admin-only uploads** to ensure rights compliance
- **DMCA takedown** workflow and reporting
- **Content moderation** tools for admins
- **Clear copyright notices** and user guidelines

### Authentication
- **JWT tokens** with refresh mechanism
- **Role-based access control** (admin, user)
- **Secure session management**
- **Rate limiting** and DDoS protection

## 🌟 Future Enhancements

### Planned Features
- **Offline reading** with PWA support
- **Multi-language UI** (English + Turkish)
- **Reading progress** tracking and bookmarks
- **Social features** (reading groups, recommendations)
- **Advanced search** with filters and tags
- **Mobile apps** for iOS and Android

### Technical Improvements
- **Real TTS integration** with cloud providers
- **PDF processing** pipeline for text extraction
- **Search indexing** with Elasticsearch
- **Analytics dashboard** for admins
- **Performance monitoring** and optimization

## 🤝 Contributing

### Development Team
- **Jane** - Lead Developer
- **Krishna** - Lead Developer & System Admin

### Admin Team
- **Yasemin** - Content Administrator
- **Kevser** - Content Administrator
- **Krishna** - System Administrator

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js community** for 3D graphics support
- **Framer Motion** for smooth animations
- **Tailwind CSS** for the design system
- **Accessibility advocates** for guidance on inclusive design

---

**Book Heaven** - Where every story finds its reader, and every reader finds their story. 🌿📚✨
