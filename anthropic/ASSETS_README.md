# Practice Assets for "Claude for Financial Consultants" Series

This folder contains practice files designed to enhance hands-on learning throughout the module series.

---

## 📁 Available Assets

### 1. **Q4_financials.csv**
**Purpose**: Real-world financial data for analysis exercises  
**Content**: Q4 2024 financial performance for 6 companies
- Monthly revenue, expenses, and profit data
- Year-over-year growth trends
- Customer metrics and transaction values
- Contains intentional anomalies for learning (e.g., RetailHub's November dip, MediaCorp's volatility)

**Integration Points**:
- **Module 4**: Use in "Multi-Format Conversion" exercise
- **Module 5**: Automation chain practice - "Analyze Q4_financials.csv and generate risk matrix"
- **Homework**: "Create summary email for top-performing client"

**Sample Prompts**:
```
claude "Analyze Q4_financials.csv and identify the top 2 performing companies by profit growth. Create a brief summary."

claude "Review Q4_financials.csv and flag any companies with declining November performance. Suggest 2 potential causes."

claude "Generate a client email for TechStart Inc highlighting their strong Q4 performance, using data from Q4_financials.csv"
```

---

### 2. **client_success_story.md**
**Purpose**: Pre-formatted markdown content for conversion exercises  
**Content**: Professional case study of TechStart Inc's Q4 transformation
- Executive summary
- Challenge/Strategy/Results structure
- Data table and key metrics
- Testimonial and lessons learned

**Integration Points**:
- **Module 4, Part 7**: Replace generic conversion example with this real story
- **Exercise**: Convert to HTML with premium styling
- **Exercise**: Convert to plain text email for client sharing
- **Exercise**: Add company logo and brand colors

**Sample Prompts**:
```
claude "Convert client_success_story.md to a beautiful HTML email with inline CSS, suitable for Outlook."

claude "Create a plain-text version of client_success_story.md suitable for SMS or WhatsApp sharing (max 500 words)."

claude "Transform client_success_story.md into a PDF-ready HTML with print styles (A4 page, serif fonts, page breaks)."
```

---

### 3. **financial_consulting_logo.svg**
**Purpose**: Branding asset for document personalization  
**Content**: Professional SVG logo with:
- Growth arrow visualization
- Dollar sign symbol
- Company initials (FC)
- Orange/gold color scheme matching the module theme

**Integration Points**:
- **Module 4**: Add logo to converted HTML emails
- **Module 5**: Brand automation chain outputs
- **Exercise**: "Add our logo to the success story HTML header"

**Sample Prompts**:
```
claude "Insert financial_consulting_logo.svg into the header of client_success_story.html, centered and 150px wide."

claude "Create a branded email template that includes our logo and converts client_success_story.md content."
```

---

## 🎯 Suggested Module Integration

### Module 4 Enhancement (CLAUDE.md & File Operations)

**Current State**: Generic file conversion examples  
**Enhancement**: Real-world workflow using all 3 assets

**New Exercise Section** (add after line 620 in part_4.html):

```markdown
### 🎯 Hands-On Challenge: Complete Client Deliverable Workflow

You have three assets in your folder:
- Q4_financials.csv (raw data)
- client_success_story.md (narrative)
- financial_consulting_logo.svg (branding)

**Your Mission**: Create a complete, branded client report.

**Step 1**: Analyze the Data
$ claude "Review Q4_financials.csv and verify the metrics in client_success_story.md are accurate."

**Step 2**: Brand the Story
$ claude "Convert client_success_story.md to HTML with:
- Our logo (financial_consulting_logo.svg) in the header
- Orange accent colors (#fd7e14)
- Professional styling for email delivery
- Inline CSS for Outlook compatibility"

**Step 3**: Create Supporting Materials
$ claude "Using Q4_financials.csv, create a 1-page executive dashboard showing:
- Top 3 performing companies
- Key Q4 trends
- Risk indicators
Output as HTML with charts."
```

---

### Module 5 Enhancement (Automation Chains)

**New Automation Chain Example** (replace theoretical example):

```markdown
### Real-World Chain: Quarterly Financial Review Workflow

**The Chain**:
1. **Data Analysis**: "Read Q4_financials.csv and identify anomalies"
2. **Risk Assessment**: "Generate risk matrix for flagged companies"
3. **Client Communication**: "Draft emails to at-risk clients using client_success_story.md as template"
4. **Executive Summary**: "Create 1-page board summary with logo"

**Human Checkpoints**:
- After Step 2: Review risk classifications
- After Step 3: Approve client-facing language
```

---

## 💡 Additional Asset Ideas (Future)

1. **sample_invoice.pdf** - Practice document parsing
2. **client_meeting_notes.txt** - Raw notes to structure
3. **company_stylesheet.css** - Brand guidelines
4. **budget_template.xlsx** - Structured data manipulation
5. **compliance_checklist.json** - Governance automation

---

## 🔄 Maintenance Notes

- Update Q4_financials.csv quarterly with new data
- Version client_success_story.md as "real" projects complete
- Add client testimonials to story as permissions allow
- Keep logo SVG simple for easy customization

---

**Created**: September 2025  
**Last Updated**: October 2025  
**Maintained By**: Beyond Dictionary 

