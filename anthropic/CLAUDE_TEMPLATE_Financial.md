# Project Context: Financial Client Deliverables

## Project Type
Financial consulting deliverables for Q4 2024 client reporting and analysis.

## Business Context
- **Audience**: CFOs, Finance Directors, Board Members
- **Tone**: Professional, data-driven, actionable
- **Purpose**: Quarterly performance review and strategic recommendations
- **Compliance**: Ensure confidentiality disclaimers on all outputs

## File Structure
```
/Practice_Folder/
├── Q4_financials.csv          # Source data (6 companies, Oct-Dec)
├── client_success_story.md    # Case study template
├── financial_consulting_logo.svg  # Branding asset
├── CLAUDE.md                  # This file
└── outputs/                   # Generated files go here
    ├── analysis_reports/
    ├── client_emails/
    └── executive_dashboards/
```

## Required Standards

### Communication Standards
- **All client emails must**:
  - Use formal salutations: "Dear [Name],"
  - Include confidentiality footer
  - Close with "Best regards," or "Sincerely,"
  - Never use casual language: "Hey", "Cheers", "FYI"
  
- **All reports must**:
  - Include executive summary at top
  - Use data tables with proper formatting
  - Cite source data (e.g., "Source: Q4_financials.csv")
  - Include date stamp

### Data Handling
- **Currency**: Always format as USD with comma separators ($245,000)
- **Percentages**: Round to 1 decimal place (12.5%)
- **Growth Rates**: Always specify YoY (Year-over-Year) or MoM (Month-over-Month)
- **Negative Trends**: Flag with visual indicator (⚠️ or red highlight in HTML)

### Branding Guidelines
- **Primary Color**: Orange (#fd7e14)
- **Secondary Color**: Dark Orange (#e87312)
- **Background Accent**: Light Orange (#fff7ed)
- **Text**: Dark Gray (#212529)
- **Logo Placement**: Top-left or centered header, 150px max width

### Output Formats

#### HTML Email (Outlook-compatible)
- Inline CSS only (no external stylesheets)
- Max-width: 600px
- Font: Arial, sans-serif
- Include logo as inline SVG or base64
- Test on white and dark backgrounds

#### Plain Text Email
- Max line length: 72 characters
- Use plain ASCII for charts/tables
- Include clickable URLs in full (https://...)
- No markdown formatting

#### PDF-Ready HTML
- A4 page size (210mm × 297mm)
- Serif font: Georgia or Times New Roman
- Page breaks: `page-break-after: always;`
- Print-friendly colors (avoid pure black)

## Forbidden Practices
- ❌ Never include actual account numbers or PII
- ❌ Never use informal greetings in client communications
- ❌ Never present unverified data without "preliminary" disclaimer
- ❌ Never send attachments without scanning for sensitive data
- ❌ Never use external image URLs in emails (inline only)

## Analysis Guidelines

### When Analyzing Q4_financials.csv:
1. **Always calculate**: 
   - Profit margin % = (Profit / Revenue) × 100
   - QoQ growth = ((Dec - Oct) / Oct) × 100
   - Average customer value = Revenue / Customer_Count

2. **Flag these patterns**:
   - Declining revenue for 2+ consecutive months
   - Profit margin below 15%
   - Negative YoY growth
   - Customer count declining while revenue grows (unsustainable)

3. **Risk Matrix Classification**:
   - **High Risk**: Negative profit OR declining revenue + customers
   - **Medium Risk**: Declining margins OR volatile growth
   - **Low Risk**: Consistent growth across all metrics

### When Writing Client Emails:
- Start with specific achievement or metric
- Use "you" and "your" (not "the company")
- Include 1 data point in subject line
- Maximum 3 paragraphs for initial outreach
- Always include next step or call-to-action

## Example Workflows

### Workflow 1: New Client Onboarding Email
```bash
claude "Using client_success_story.md as inspiration, create a welcome email 
for EcomGrowth (from Q4_financials.csv) highlighting their strong Q4 performance. 
Include their Dec revenue growth rate in the subject line."
```

### Workflow 2: Risk Alert
```bash
claude "Analyze Q4_financials.csv and identify companies with declining November 
performance. Create a risk assessment report with recommended actions."
```

### Workflow 3: Executive Dashboard
```bash
claude "Generate an HTML executive dashboard showing:
1. Top 3 companies by profit growth
2. Companies requiring attention
3. Overall Q4 trend summary
Use our branding colors and include the logo."
```

## Quality Checklist
Before finalizing any deliverable:
- [ ] Tone is professional and appropriate for audience
- [ ] All data is sourced and accurate
- [ ] Branding is consistent (colors, logo, fonts)
- [ ] No sensitive information is exposed
- [ ] Confidentiality disclaimer is included
- [ ] Contact information is correct
- [ ] File is named descriptively (e.g., `TechStart_Q4_Analysis_2024-01-15.html`)

## Iteration Guidelines
- **For client emails**: Get approval before sending
- **For reports**: Review data accuracy first, formatting second
- **For dashboards**: Prioritize clarity over visual complexity
- **For risk assessments**: Conservative is better than aggressive

---

**Template Version**: 1.0  
**Last Updated**: January 2025  
**For**: Claude for Financial Consultants - Practice Exercises

