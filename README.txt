# AWS Cost Dashboard

A modern, responsive web application built with **Next.js**, **React**, **Tailwind CSS**, and the **AWS SDK** to visualize and analyze AWS billing and usage data from Cost Explorer APIs. Features include timeline controls, dynamic filters, charts (Recharts), budget alerts, exports (CSV/PDF), and drill-down views.

aws-cost-dashboard/
├── .env.local                          # AWS credentials (ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION) - Git ignored
├── .gitignore                          # Standard Node.js/Next.js ignores
├── next.config.js                      # Next.js configuration (env vars, etc.)
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS config for Tailwind
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── README.md                           # Project documentation (this file)
│
├── app/                                # Next.js App Router: Pages, layouts, and API routes
│   ├── api/
│   │   └── cost-data/
│   │       └── route.ts                # Server-side API for fetching Cost Explorer data
│   ├── globals.css                     # Global styles (Tailwind directives)
│   ├── layout.tsx                      # Root layout (HTML structure, fonts)
│   ├── page.tsx                        # Main dashboard page (client-side)
│   └── favicon.ico                     # App favicon
│
├── components/                         # Reusable React components
│   ├── TimelineControls.tsx            # Predefined/custom date range selector
│   ├── Filters.tsx                     # Service/region/subcategory filters
│   ├── CostMonitor.tsx                 # Current spend vs. forecast card
│   ├── BudgetStatus.tsx                # Budget usage and alerts
│   ├── CostBreakdown.tsx               # Pie chart for cost breakdowns
│   ├── TrendGraph.tsx                  # Line chart for cost trends
│   ├── TopNView.tsx                    # Top 5 services table
│   ├── SearchBar.tsx                   # Search input for services/usage
│   ├── ExportButton.tsx                # CSV/PDF export buttons
│   └── DrillDown.tsx                   # Modal for subcategory drill-down
│
├── lib/                                # Shared utilities and AWS SDK logic
│   ├── aws-client.ts                   # Cost Explorer client initialization
│   ├── fetch-cost-data.ts              # API wrappers for GetCostAndUsage, GetCostForecast, etc.
│   └── types.ts                        # TypeScript interfaces (CostData, ForecastData, etc.)
│
├── public/                             # Static assets (images, icons)
│   └── ...                             # (e.g., logos, favicons)
└── .eslintrc.json                      # ESLint configuration (optional)

