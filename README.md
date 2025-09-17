# N8N Lifecycle Atlas

An AI-powered automation tool that analyzes Customer.io workspace data to automatically generate customer journey maps, lifecycle stage categorization, and campaign clustering.

## 🎯 Overview

The Lifecycle Atlas transforms hours of manual campaign analysis into minutes of automated insights, helping Customer Success Managers (CSMs) understand customer journey coverage and identify optimization opportunities.

## 🚀 Quick Start

1. **Access Requirements:**
   - Tailscale connection for n8n access
   - Google Cloud project access (contact Terrence Brown)
   - Miro license (contact Alvin if needed)

2. **Run Analysis:**
   - Generate export URL from Customer.io workspace
   - Download JSON file to your computer
   - Upload to n8n form
   - Delete local file (compliance requirement)
   - Wait for email with results (2-3 minutes)

3. **Review Outputs:**
   - **Google Sheets:** Comprehensive data analysis
   - **Miro Board:** Visual journey map (requires manual layout fix)

## 📁 Project Structure

```
├── README.md                           # This file
├── HANDOVER_DOCUMENTATION.md          # Complete handover guide
├── n8n Lifecycle Atlas.json           # Main n8n workflow
├── .env                               # Environment variables
├── Process Raw Data.js                # Data normalization logic
├── Comprehensive Program Analysis.js  # AI response processing
├── Summary Analysis.js                # Google Sheets generation
├── Stage Mapper.js                    # Miro stage nodes
├── Cluster Mapper.js                  # Miro cluster nodes
├── Type Mapper.js                     # Miro type nodes
├── Examples Mapper.js                 # Miro example nodes
├── Message a model.xml                # AI categorization prompt
└── Generate Stages and Clusters.xml   # AI clustering prompt
```

## 🛠 Technology Stack

- **Workflow Engine:** n8n
- **AI Model:** Google Gemini 2.0 Flash & 2.5 Pro
- **Data Storage:** Google Sheets & Drive
- **Visualization:** Miro API
- **Language:** JavaScript (Node.js)

## 📊 Key Features

- **Automated Categorization:** 8 lifecycle stages with smart clustering
- **Visual Journey Maps:** Interactive Miro mindmaps
- **Data Analysis:** Comprehensive Google Sheets with formulas
- **Standardized Output:** Consistent format across all analyses
- **Compliance Ready:** Secure data handling with automatic cleanup

## ⚠️ Important Notes

- **Miro Display:** Initial mindmap appears messy - use Auto Layout + manual positioning
- **Large Files:** Processing may be slower for big workspaces
- **Email Delays:** If no email after 3 hours, retry the process
- **File Handling:** Must download, save locally, upload, then delete

## 📖 Documentation

For complete setup instructions, troubleshooting, and technical details, see [HANDOVER_DOCUMENTATION.md](HANDOVER_DOCUMENTATION.md).

## 👥 Support

- **Technical Issues:** Contact Terrence Brown
- **Miro Access:** Contact Alvin (IT)
- **General Questions:** CSM AI Champions Team

## 📈 Success Story

Successfully implemented for Gelato account by Stefano, demonstrating the tool's effectiveness in real-world CSM scenarios.

---

**Author:** Pranav Kafle  
**Version:** 1.0  
**Last Updated:** September 17, 2025
