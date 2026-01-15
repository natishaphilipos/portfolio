# Nathanim Philipos Portfolio - Technical Project Overview

**Project:** Professional GRC Portfolio Website  
**Domain:** https://nathanimphilipos.com  
**Repository:** https://github.com/natishaphilipos/portfolio  
**Created:** January 15, 2026  
**Stack:** React 18 + Vite + TailwindCSS + Framer Motion + AWS

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [AWS Infrastructure](#aws-infrastructure)
3. [Application Stack](#application-stack)
4. [Code Structure](#code-structure)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Deployment Process](#deployment-process)
7. [Configuration Reference](#configuration-reference)
8. [Maintenance Commands](#maintenance-commands)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROUTE 53 (DNS)                                       │
│  Hosted Zone: Z0909268N3DB0IS88J26                                          │
│  Domain: nathanimphilipos.com                                                │
│  Records: A (root) → CloudFront, A (www) → CloudFront                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ACM CERTIFICATE (SSL/TLS)                                │
│  ARN: arn:aws:acm:us-east-1:811965657607:certificate/c79ba309-...           │
│  Domains: nathanimphilipos.com, www.nathanimphilipos.com                    │
│  Validation: DNS (auto-validated via Route 53)                              │
│  Status: ISSUED                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLOUDFRONT DISTRIBUTION (CDN)                             │
│  Distribution ID: E1VNINUQLGACO4                                            │
│  Domain: d2qig4use0ngmq.cloudfront.net                                      │
│  Price Class: PriceClass_100 (NA + Europe)                                  │
│  HTTP Version: HTTP/2 and HTTP/3                                            │
│  TLS: TLSv1.2_2021 minimum                                                  │
│  Behaviors:                                                                  │
│    - Viewer Protocol: Redirect HTTP → HTTPS                                 │
│    - Cache Policy: CachingOptimized (658327ea-f89d-4fab-a63d-7e88639e58f6) │
│    - Origin Request: CORS-S3Origin                                          │
│    - Response Headers: SecurityHeadersPolicy                                │
│  Custom Error Responses:                                                     │
│    - 403 → /index.html (200) - SPA routing                                  │
│    - 404 → /index.html (200) - SPA routing                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              CLOUDFRONT ORIGIN ACCESS CONTROL (OAC)                          │
│  Name: nathanim-portfolio-oac                                                │
│  Signing: sigv4 (always)                                                     │
│  Purpose: Secure S3 access without public bucket                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         S3 BUCKET (Origin)                                   │
│  Bucket: nathanim-portfolio-811965657607                                    │
│  Region: us-east-1                                                           │
│  Public Access: BLOCKED (all 4 settings enabled)                            │
│  Versioning: Enabled                                                         │
│  Website Config: index.html (index + error for SPA)                         │
│  Bucket Policy: CloudFront OAC access only                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Request** → `https://nathanimphilipos.com`
2. **Route 53** → Resolves A record to CloudFront distribution
3. **CloudFront** → Terminates TLS using ACM certificate
4. **CloudFront** → Checks edge cache for content
5. **Cache Miss** → CloudFront requests from S3 via OAC (signed request)
6. **S3** → Returns static assets (HTML, JS, CSS, images)
7. **CloudFront** → Caches response, returns to user
8. **SPA Routing** → 403/404 errors return index.html for client-side routing

---

## AWS Infrastructure

### CloudFormation Stack

**Stack Name:** `nathanim-portfolio`  
**Region:** `us-east-1`  
**Template:** `cloudformation/website-existing-resources.yaml`

#### Resources Created

| Resource Type | Logical ID | Physical ID |
|---------------|------------|-------------|
| AWS::S3::Bucket | WebsiteBucket | nathanim-portfolio-811965657607 |
| AWS::S3::BucketPolicy | WebsiteBucketPolicy | (auto-generated) |
| AWS::CloudFront::OriginAccessControl | CloudFrontOAC | nathanim-portfolio-oac |
| AWS::CloudFront::Distribution | CloudFrontDistribution | E1VNINUQLGACO4 |
| AWS::Route53::RecordSet | RootDomainRecord | nathanimphilipos.com (A) |
| AWS::Route53::RecordSet | WwwDomainRecord | www.nathanimphilipos.com (A) |

#### Pre-existing Resources (Referenced)

| Resource | ID/ARN |
|----------|--------|
| Route 53 Hosted Zone | Z0909268N3DB0IS88J26 |
| ACM Certificate | arn:aws:acm:us-east-1:811965657607:certificate/c79ba309-4d09-4bdd-acda-6a205965632a |

### CloudFormation Template

```yaml
# cloudformation/website-existing-resources.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Website infrastructure using existing Route 53 hosted zone and ACM certificate'

Parameters:
  DomainName:
    Type: String
    Default: 'nathanimphilipos.com'
  
  ProjectName:
    Type: String
    Default: 'nathanim-portfolio'

  ExistingHostedZoneId:
    Type: String
    Default: 'Z0909268N3DB0IS88J26'

  ExistingCertificateArn:
    Type: String
    Default: 'arn:aws:acm:us-east-1:811965657607:certificate/c79ba309-4d09-4bdd-acda-6a205965632a'

Resources:
  # S3 Bucket - Private, CloudFront-only access
  WebsiteBucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      BucketName: !Sub '${ProjectName}-${AWS::AccountId}'
      WebsiteConfiguration:
        IndexDocument: 'index.html'
        ErrorDocument: 'index.html'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  # Bucket Policy - Allow CloudFront OAC only
  WebsiteBucketPolicy:
    Type: 'AWS::S3::BucketPolicy'
    Properties:
      Bucket: !Ref WebsiteBucket
      PolicyDocument:
        Statement:
          - Sid: AllowCloudFrontOAI
            Effect: Allow
            Principal:
              Service: cloudfront.amazonaws.com
            Action: 's3:GetObject'
            Resource: !Sub '${WebsiteBucket.Arn}/*'
            Condition:
              StringEquals:
                'AWS:SourceArn': !Sub 'arn:aws:cloudfront::${AWS::AccountId}:distribution/${CloudFrontDistribution}'

  # Origin Access Control - Secure S3 access
  CloudFrontOAC:
    Type: 'AWS::CloudFront::OriginAccessControl'
    Properties:
      OriginAccessControlConfig:
        Name: !Sub '${ProjectName}-oac'
        OriginAccessControlOriginType: s3
        SigningBehavior: always
        SigningProtocol: sigv4

  # CloudFront Distribution - Global CDN
  CloudFrontDistribution:
    Type: 'AWS::CloudFront::Distribution'
    Properties:
      DistributionConfig:
        Enabled: true
        Comment: !Sub 'CDN for ${ProjectName}'
        DefaultRootObject: 'index.html'
        HttpVersion: http2and3
        PriceClass: PriceClass_100
        Aliases:
          - !Ref DomainName
          - !Sub 'www.${DomainName}'
        ViewerCertificate:
          AcmCertificateArn: !Ref ExistingCertificateArn
          SslSupportMethod: sni-only
          MinimumProtocolVersion: TLSv1.2_2021
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt WebsiteBucket.RegionalDomainName
            OriginAccessControlId: !Ref CloudFrontOAC
            S3OriginConfig: {}
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods: [GET, HEAD, OPTIONS]
          CachedMethods: [GET, HEAD]
          Compress: true
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6
          OriginRequestPolicyId: 88a5eaf4-2fd4-4709-b370-b4c650ea3fcf
          ResponseHeadersPolicyId: 67f7725c-6f97-4210-82d7-5512b31e9d03
        CustomErrorResponses:
          - ErrorCode: 403
            ResponseCode: 200
            ResponsePagePath: /index.html
            ErrorCachingMinTTL: 300
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
            ErrorCachingMinTTL: 300

  # DNS Records - Point domain to CloudFront
  RootDomainRecord:
    Type: 'AWS::Route53::RecordSet'
    Properties:
      HostedZoneId: !Ref ExistingHostedZoneId
      Name: !Ref DomainName
      Type: A
      AliasTarget:
        HostedZoneId: Z2FDTNDATAQYW2  # CloudFront global hosted zone ID
        DNSName: !GetAtt CloudFrontDistribution.DomainName
        EvaluateTargetHealth: false

  WwwDomainRecord:
    Type: 'AWS::Route53::RecordSet'
    Properties:
      HostedZoneId: !Ref ExistingHostedZoneId
      Name: !Sub 'www.${DomainName}'
      Type: A
      AliasTarget:
        HostedZoneId: Z2FDTNDATAQYW2
        DNSName: !GetAtt CloudFrontDistribution.DomainName
        EvaluateTargetHealth: false

Outputs:
  WebsiteBucketName:
    Value: !Ref WebsiteBucket
  CloudFrontDistributionId:
    Value: !Ref CloudFrontDistribution
  CloudFrontURL:
    Value: !GetAtt CloudFrontDistribution.DomainName
  WebsiteURL:
    Value: !Sub 'https://${DomainName}'
```

---

## Application Stack

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React | 18.2.0 | UI components and state management |
| Build Tool | Vite | 5.0.8 | Fast development server and optimized builds |
| Styling | TailwindCSS | 3.3.6 | Utility-first CSS framework |
| Animations | Framer Motion | 10.16.16 | Scroll animations and transitions |
| Icons | Lucide React | 0.294.0 | SVG icon library |
| CSS Processing | PostCSS + Autoprefixer | 8.4.32 / 10.4.16 | CSS transformations |

### Design System

**Theme:** Minimal Black & White with Bold Modern styling

```javascript
// tailwind.config.js - Custom theme extensions
{
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#404040',
    muted: '#737373',
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  animation: {
    'fade-in': 'fadeIn 0.6s ease-out forwards',
    'slide-up': 'slideUp 0.6s ease-out forwards',
    'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
    'scale-in': 'scaleIn 0.5s ease-out forwards',
  }
}
```

---

## Code Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline
├── dist/                           # Build output (gitignored in production)
│   ├── index.html
│   └── assets/
│       ├── index-[hash].css
│       ├── index-[hash].js
│       ├── vendor-[hash].js        # React, React-DOM
│       └── motion-[hash].js        # Framer Motion
├── node_modules/                   # Dependencies
├── public/
│   ├── favicon.svg                 # Site favicon (N logo)
│   └── resume.pdf                  # Downloadable resume
├── src/
│   ├── App.jsx                     # Main application component
│   ├── index.css                   # Global styles + Tailwind directives
│   └── main.jsx                    # React entry point
├── .gitignore
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── package-lock.json
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind configuration
├── vite.config.js                  # Vite build configuration
└── PROJECT_OVERVIEW.md             # This document
```

### Key Files

#### `src/App.jsx` - Main Application (500+ lines)

**Structure:**
```javascript
// Data Layer
const portfolioData = {
  name: "Nathanim Philipos",
  title: "GRC Professional",
  location: "St. Louis, MO",
  email: "nathan.philipos12@gmail.com",
  linkedin: "...",
  github: "...",
  website: "https://tenagrc.com",
  summary: [...],           // 3 paragraphs
  professionalSkills: [...], // 6 competencies
  technicalSkills: {...},    // 6 categories
  certifications: [...],     // ISO 42001 Lead Auditor
  projects: [...],           // 3 projects with achievements
  articles: [...]            // 2 LinkedIn articles
}

// Utility Components
function AnimatedSection({ children, delay }) {...}  // Scroll animations

// Section Components
function Navbar() {...}      // Fixed navigation with mobile menu
function Hero() {...}        // Landing section with parallax
function About() {...}       // Professional summary + quick info
function Skills() {...}      // Professional + technical skills grid
function Projects() {...}    // Featured projects with tech stacks
function Contact() {...}     // CTA section with social links
function Footer() {...}      // Copyright and credits

// Root Component
function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}
```

**Animation System:**
```javascript
// Scroll-triggered animations using Framer Motion
function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax hero effect
function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  // ...
}
```

#### `vite.config.js` - Build Configuration

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
})
```

**Build Output Optimization:**
- Code splitting: Vendor chunk (~141KB), Motion chunk (~106KB), App chunk (~24KB)
- Tree shaking: Only used Lucide icons included
- Minification: esbuild (faster than terser)
- Compression: Gzip-ready assets

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main                    # Trigger on push to main
  workflow_dispatch:            # Manual trigger option

jobs:
  deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    
    steps:
      # 1. Checkout repository
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Setup Node.js with caching
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      # 3. Install dependencies (clean install)
      - name: Install dependencies
        run: npm ci

      # 4. Build production bundle
      - name: Build project
        run: npm run build
        env:
          NODE_ENV: production

      # 5. Configure AWS credentials from secrets
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      # 6. Sync to S3 with cache optimization
      - name: Deploy to S3
        run: |
          # Static assets: Long cache (1 year, immutable)
          aws s3 sync dist/ s3://${{ secrets.AWS_BUCKET_NAME }} \
            --delete \
            --cache-control "public,max-age=31536000,immutable" \
            --exclude "index.html" \
            --exclude "*.html"
          
          # HTML files: No cache (always fresh)
          aws s3 sync dist/ s3://${{ secrets.AWS_BUCKET_NAME }} \
            --cache-control "public,max-age=0,must-revalidate" \
            --exclude "*" \
            --include "*.html"

      # 7. Invalidate CloudFront cache
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} \
            --paths "/*"

      # 8. Success notification
      - name: Deployment successful
        run: |
          echo "✅ Deployment completed successfully!"
          echo "🌐 Live at: https://nathanimphilipos.com"
```

### Pipeline Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Developer  │────▶│    GitHub    │────▶│   Actions    │
│  git push    │     │  Repository  │     │   Runner     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                     ┌───────────────────────────┘
                     ▼
         ┌─────────────────────┐
         │  1. Checkout Code   │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  2. Setup Node 18   │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  3. npm ci          │ (cached)
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  4. npm run build   │ (~1 min)
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  5. AWS Credentials │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  6. S3 Sync         │ (~10 sec)
         │  - Delete removed   │
         │  - Cache headers    │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  7. CloudFront      │ (~1-2 min)
         │     Invalidation    │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  8. ✅ Complete     │
         │  Live in 2-3 mins   │
         └─────────────────────┘
```

### GitHub Secrets Configuration

| Secret Name | Value | Purpose |
|-------------|-------|---------|
| `AWS_ACCESS_KEY_ID` | AKIA... | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | KoZr... | IAM user secret key |
| `AWS_BUCKET_NAME` | nathanim-portfolio-811965657607 | S3 bucket for deployment |
| `AWS_DISTRIBUTION_ID` | E1VNINUQLGACO4 | CloudFront distribution for invalidation |

### Cache Strategy

| File Type | Cache-Control Header | TTL | Reason |
|-----------|---------------------|-----|--------|
| `*.html` | `public,max-age=0,must-revalidate` | 0 | Always fetch latest HTML |
| `*.js` | `public,max-age=31536000,immutable` | 1 year | Hashed filenames = cache forever |
| `*.css` | `public,max-age=31536000,immutable` | 1 year | Hashed filenames = cache forever |
| `*.pdf` | Default | CloudFront default | Resume download |
| `*.svg` | Default | CloudFront default | Favicon |

---

## Deployment Process

### Initial Deployment (One-time)

```bash
# 1. Create CloudFormation stack
aws cloudformation create-stack \
  --stack-name nathanim-portfolio \
  --template-body file://cloudformation/website-existing-resources.yaml \
  --region us-east-1

# 2. Wait for stack creation (~15 min)
aws cloudformation wait stack-create-complete \
  --stack-name nathanim-portfolio \
  --region us-east-1

# 3. Get stack outputs
aws cloudformation describe-stacks \
  --stack-name nathanim-portfolio \
  --region us-east-1 \
  --query 'Stacks[0].Outputs'

# 4. Build application
cd portfolio
npm install
npm run build

# 5. Deploy to S3
aws s3 sync dist/ s3://nathanim-portfolio-811965657607 --delete

# 6. Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id E1VNINUQLGACO4 \
  --paths "/*"
```

### Ongoing Deployments (Automatic via CI/CD)

```bash
# Just push to main branch
git add .
git commit -m "Update portfolio content"
git push origin main

# GitHub Actions automatically:
# 1. Builds the project
# 2. Syncs to S3
# 3. Invalidates CloudFront
# 4. Live in ~2-3 minutes
```

### Manual Deployment (Alternative)

```bash
cd portfolio
npm run build
aws s3 sync dist/ s3://nathanim-portfolio-811965657607 --delete
aws cloudfront create-invalidation --distribution-id E1VNINUQLGACO4 --paths "/*"
```

---

## Configuration Reference

### AWS Account Details

| Property | Value |
|----------|-------|
| Account ID | 811965657607 |
| Region | us-east-1 (N. Virginia) |
| IAM User | Admin |

### Domain Configuration

| Property | Value |
|----------|-------|
| Domain | nathanimphilipos.com |
| Registrar | (Your registrar) |
| Nameservers | AWS Route 53 |
| Hosted Zone ID | Z0909268N3DB0IS88J26 |

### SSL Certificate

| Property | Value |
|----------|-------|
| ARN | arn:aws:acm:us-east-1:811965657607:certificate/c79ba309-4d09-4bdd-acda-6a205965632a |
| Domains | nathanimphilipos.com, www.nathanimphilipos.com |
| Validation | DNS |
| Status | ISSUED |

### S3 Bucket

| Property | Value |
|----------|-------|
| Name | nathanim-portfolio-811965657607 |
| Region | us-east-1 |
| Versioning | Enabled |
| Public Access | Blocked |
| Access | CloudFront OAC only |

### CloudFront Distribution

| Property | Value |
|----------|-------|
| Distribution ID | E1VNINUQLGACO4 |
| Domain Name | d2qig4use0ngmq.cloudfront.net |
| Aliases | nathanimphilipos.com, www.nathanimphilipos.com |
| Price Class | PriceClass_100 (NA + Europe) |
| HTTP Version | HTTP/2 and HTTP/3 |
| TLS Version | TLSv1.2_2021 minimum |

---

## Maintenance Commands

### View Deployment Status

```bash
# Check CloudFormation stack
aws cloudformation describe-stacks --stack-name nathanim-portfolio --region us-east-1

# Check CloudFront distribution status
aws cloudfront get-distribution --id E1VNINUQLGACO4 --query 'Distribution.Status'

# List S3 bucket contents
aws s3 ls s3://nathanim-portfolio-811965657607

# Check recent invalidations
aws cloudfront list-invalidations --distribution-id E1VNINUQLGACO4 --max-items 5
```

### Update Infrastructure

```bash
# Update CloudFormation stack
aws cloudformation update-stack \
  --stack-name nathanim-portfolio \
  --template-body file://cloudformation/website-existing-resources.yaml \
  --region us-east-1
```

### Delete Infrastructure (Caution!)

```bash
# Empty S3 bucket first
aws s3 rm s3://nathanim-portfolio-811965657607 --recursive

# Delete object versions
aws s3api list-object-versions --bucket nathanim-portfolio-811965657607 \
  --query 'Versions[*].[Key,VersionId]' --output text | \
  while read key version; do
    aws s3api delete-object --bucket nathanim-portfolio-811965657607 \
      --key "$key" --version-id "$version"
  done

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name nathanim-portfolio --region us-east-1
```

### Rotate AWS Credentials

```bash
# Create new access key
aws iam create-access-key --user-name Admin

# Update GitHub secret
gh secret set AWS_ACCESS_KEY_ID --body "NEW_KEY_ID"
gh secret set AWS_SECRET_ACCESS_KEY --body "NEW_SECRET_KEY"

# Delete old access key
aws iam delete-access-key --user-name Admin --access-key-id OLD_KEY_ID
```

---

## Cost Estimate

### Monthly Costs (Approximate)

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| S3 Storage | 5 GB free | ~$0.02/GB |
| S3 Requests | 20,000 GET free | ~$0.0004/1000 |
| CloudFront | 1 TB free | ~$0.085/GB |
| Route 53 | - | $0.50/month |
| ACM Certificate | Always free | $0 |
| **Total** | **~$0.50/month** | **~$1-3/month** |

---

## Security Features

1. **HTTPS Only** - HTTP redirects to HTTPS
2. **TLS 1.2+** - Modern encryption only
3. **Private S3** - No public bucket access
4. **OAC Signed Requests** - CloudFront signs all S3 requests
5. **Security Headers** - XSS protection, clickjacking prevention
6. **DDoS Protection** - AWS Shield Standard (included)
7. **Secrets Management** - Credentials in GitHub Secrets, never in code

---

## Future Improvements

- [ ] Add contact form with AWS Lambda + SES
- [ ] Implement preview deployments for pull requests
- [ ] Add Slack/Discord notifications for deployments
- [ ] Set up AWS CloudWatch monitoring
- [ ] Add Google Analytics or Plausible
- [ ] Implement A/B testing with CloudFront functions

---

**Document Version:** 1.0  
**Last Updated:** January 15, 2026  
**Author:** Generated during portfolio setup with Cascade AI
