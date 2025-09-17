# Purpose

Lifecycle Atlas is an internal prototype that helps Customer.io CSMs instantly visualise a customer's full lifecycle messaging strategy using existing campaign and newsletter data. This AI-powered map enables strategic conversations, exposes gaps in messaging, and positions Customer.io as a proactive growth partner to our customers.

---

### Problem

Today, no CSM has the bandwidth or tooling to audit and map ***all*** customer messaging across the lifecycle. Even basic analysis of subject lines, campaign purpose, and sequencing for any premium account is extremely time-intensive and is estimated to take at least **10 full business days.**

<aside>
➕

**How did I arrive at that number?**

- I [attempted to categorise](https://docs.google.com/spreadsheets/d/1YjC5zFWLBmcgSfjNtW6rRwcZxOs0ei0XTREwe5aLhFI/edit?usp=sharing) all emails of Printify’s regular onboarding campaign (10 emails) that took me 5 minutes (2 emails per minute).
- Printify has **518 campaigns** that would have taken me almost **six business days** to categorise.
- Printify has **2831 newsletters** that would have taken me almost **three business days** to categorise.
- I assumed I could generate a basic analysis in **one business day** if I had all the data, which is still very ambitious.
</aside>

- Today, customer usage analysis is limited to a few top campaigns and regular broadcasts, and it focuses on aggregated metrics.
- Anything deeper than that is rarely done unless for high-touch renewals or escalations

This means:

- Strategic gaps in messaging go unseen
- CSMs miss chances to upsell use cases or solve misuse
- Customers don't get a "big picture" perspective of their messaging maturity
- CSMs aren’t properly equipped to have strategic conversations with decision makers for value realisation.

---

### Under the hood of Lifecycle Atlas

- **Inputs:** List of all customer campaigns + newsletters + transactional messages (names and subject lines only)
- **Processing:** *[Further optimisation possible with better tooling]*
    - Source JSON exported from Fly by the CSM **only after recorded customer consent**.
    - Processing via a **company-server hosted n8n** workflow.
    - Intermediate prompt creation using **Google Gemini**. For the pilot, where API access is pending, the Gemini **web UI** can be used by the CSM; the target state is **Gemini API** once SRE provides keys.
    - **Miro** consumes the Gemini-generated meta-prompt to render the lifecycle mind map. **Raw customer data (lists) are not sent to Miro**; only the synthesized prompt is used to generate the visualization.
- **Output:** A one-page visual blueprint of the customer’s lifecycle messaging—identifying strengths, gaps, and growth opportunities across their entire messaging ecosystem.
    - Shows where campaigns exist across onboarding, activation, conversion, retention, etc.
    - Label gaps, overlaps, and opportunities
- **Time Impact:** In its current prototype form, creating a mind map in Miro takes only **10 minutes per account.** With proper tooling and integration, this can be reduced to a few minutes.

![Miro Mind-Map visualising the entire lifecycle marketing ecosystem built in [customer.io](http://customer.io/) by Printify.](attachment:5da90083-3bdb-4f10-9327-c82e0453c286:CleanShot_2025-07-11_at_20.19.112x.png)

Miro Mind-Map visualising the entire lifecycle marketing ecosystem built in [customer.io](http://customer.io/) by Printify.

---

### Value

### Strategic Impact

- Unlocks a new category of insight CSMs didn’t have before
- Makes strategic big picture conversations repeatable and scalable
- Increases likelihood of upsell, use case expansion, or renewal alignment

### For CSMs

- Saves several business weeks per account vs. manual review
- Enables strategic conversations with minimal prep
- Helps elevate positioning from support to advisory

### For Customers

- Quickly surfaces gaps and overlaps in their message strategy
- Provides actionable lifecycle recommendations
- Builds confidence in Customer.io’s consultative value

---

### **Industry Validation**

Lifecycle Atlas mirrors a growing class of marketing platforms that use customer-owned message and behavior data to map out end-user journeys and optimize lifecycle strategy. These platforms demonstrate strong strategic and financial impact by transforming campaign-level data into visual, stage-based insights.

- **Telia** used **BlueConic’s *Lifecycles*** product to visualize where each customer sat in their journey (e.g., onboarding, upgrade, renewal) using first-party campaign and behavioral data. By mapping the full lifecycle and layering in segmentation + real-time messaging, they achieved **3× conversion on upsell/cross-sell journeys** and **40% increase in targeted campaign conversion.**
    
    [Telia Company Leverages AI to Deliver Personalized Experiences in Every Customer Lifecycle Stage | BlueConic](https://www.blueconic.com/customers/case-study-telia)
    
- **Exonix** ingested campaign logs across web/email/SMS to map full-funnel behavior and identify drop-offs. This led to a **38% increase in conversions**, **18% increase in AOV**, and **24% bounce rate reduction** within 60 days.
    
    [How AI is Revolutionizing Customer Journey Mapping in Marketing](https://www.graficole.com/blogs/how-ai-is-revolutionizing-customer-journey-mapping-in-digital-marketing/?utm_source=chatgpt.com)
    
- **GAIA**, a leading Mexican e-commerce brand, used **Insider’s AI-powered *Architect*** to unify campaign and behavior data across email, push, WhatsApp, and onsite interactions. This enabled the team to map where each customer was in their lifecycle and deliver hyper-personalized journeys using features like “Next Best Channel” and “Likelihood to Purchase.” As a result, GAIA achieved a **166% increase in conversions**, **114% uplift in click-through rates**, and a **100% lift in coupon-based conversion.**
    
    https://useinsider.com/assets/media/2024/02/Gaia-Case-Study.pdf
    

These tools are well-established in marketing and product-led growth orgs — showing that AI-assisted lifecycle mapping using real campaign content is already a proven strategy. Lifecycle Atlas brings that same capability to Customer Success, offering campaign visibility, strategy clarity, and value conversations at scale.

---

# Compliance & Risk Mitigation

<aside>
📝

The following actions are thoroughly reviewed and approved by [Customer.io](http://Customer.io) General Counsel.

</aside>

### Enterprise AI Compliance

Both **Google Gemini** and **OpenAI ChatGPT (Enterprise)** explicitly commit not to use submitted data for training. Their enterprise privacy frameworks meet CIO’s *Safeguarding Data Confidentiality* standards. 

Google Gemini is preferred and will be used due to deeper compliance agreements. The usage is in line with [Compliance Best Practices for CS Using AI for Customer Work](https://www.notion.so/Compliance-Best-Practices-for-CS-Using-AI-for-Customer-Work-2264302f4c2b8041ac96fbe80b6cb18b?pvs=21).

### Data Processed

- Campaign, newsletter, and transactional message **names**
- Message **types** (Email, SMS, Push, Webhook, In‑app)
- Email **subject lines**
- Performance metrics (opens, clicks, conversions, ROI).

### Risk Mitigations

- **Anonymization**: Strip/redact personal names, identifiers, emails, phone numbers, segmentation labels, and incident details before AI processing.
- **Minimization**: Process only names, types, and subject lines (no bodies, no PII).
- **Enterprise-only**: Use only approved enterprise AI endpoints (Gemini, ChatGPT Enterprise).
- **Ephemeral handling**: Exported JSON deleted immediately after artifact creation.
- **Consent**: No processing without explicit customer opt‑in (recorded via Customer.io campaign or written confirmation).
- **Review**: All flows and anonymization rules subject to compliance review before scale‑out.

### Limitation of Use

Lifecycle Atlas will only be used when explicit customer consent is obtained in advance and retained for audit. Broader adoption depends on compliance approval.

<aside>
📝

**Approved consent-acquisition language**

We've been working on something that could give you valuable insights into your messaging strategy — **an AI-generated visualization of your complete customer lifecycle communications that identifies optimization opportunities and potential gaps**.

This lightweight analysis would map out how your campaigns and newsletters work together across your customer journey, highlighting areas where you might be missing touchpoints or could improve engagement timing.

**Here's what we'd need:** Permission to process the names and subject lines of your campaigns and newsletters using Google Gemini (our secure, enterprise AI tooling). This data would help us create your personalized messaging overview.

**Your data privacy matters to us:**

- Your data won't be used to train AI models
- We'll anonymize information wherever possible
- Data will only be retained during processing, then deleted
- This falls under your existing [Customer.io](http://customer.io/) [terms of service](https://customer.io/legal/terms-of-service)

We're committed to using your data thoughtfully — this analysis is designed specifically to help you optimize your customer engagement strategy.

**Ready to see your messaging strategy mapped out?** Just reply with "yes" and we'll get started.

</aside>

### Compliance Questionnaire

- **Does the utilisation of the following Enterprise AI with customer data comply with[**Safeguarding Data Confidentiality**](https://www.notion.so/Safeguarding-Data-Confidentiality-f50c968c2a204fb4ba8452e1a154bf97?pvs=21) and other requirements given their explicit commitment of not using any data to train their models?**
    - Google Gemini [[Generative AI in Google Workspace Privacy Hub](https://support.google.com/a/answer/15706919?hl=en)]
        
        ![CleanShot 2025-07-17 at 18.41.59@2x.png](attachment:e334731a-e63b-424d-8b57-301630327a07:CleanShot_2025-07-17_at_18.41.592x.png)
        
    - OpenAI ChatGPT [[Enterprise privacy at OpenAI](https://openai.com/enterprise-privacy/)]
        
        ![CleanShot 2025-07-17 at 18.57.05@2x.png](attachment:dffa957b-adc6-41b5-9286-400b3c6b21a3:CleanShot_2025-07-17_at_18.57.052x.png)
        
- **What are the implications of ingesting the following customer data-points to any of the above AI platforms? Under what circumstances can we be allowed to use them for the stated purpose?**
    - Names of all the Campaigns
    - Names of all the Newsletters
    - Names of all the Messages
    - Types of all the Messages
        - Emails, SMS, Push Notifications, Webhooks, In-apps
    - Subject lines of all the Emails
    - Pre-processed JSON example *(Post-processing for LLMs will extract the **BOLD** values)*
        
        ```json
        {
            "campaigns": [
                {
                    "id": "string",
                    **"name": "string", // used with LLM**
                    "type": "string",
                    "state": "string",
                    "first_started": 0
                }
            ],
            "newsletters": [
                {
                    "id": "string",
                    **"name": "string" // used with LLM**
                }
            ],
            "transactional_messages": [
                {
                    "id": "string",
                    **"name": "string", // used with LLM**
                    "type": "string"
                }
            ],
            "messages": [
                {
                    **"subject": "string", // used with LLM**
                    "action_id": "string",
                    "template_id": "string",
                    "campaign_id": "string|null",
                    "newsletter_id": "string|null",
                    "variation": "number|null",
                    "transactional_message_id": "string|null",
                    "in_app_broadcast_id": "string|null",
                    "output_id": "string",
                    **"type": "string", // used with LLM**
                    "can_segment_on_variation": "boolean",
                    "language": "string|null"
                }
            ],
            "branch_messages": [],
            "in_app_broadcasts": []
        }
        ```
        
    
    <aside>
    ⚠️
    
    **Potentially risky identifying information within the above data-points:**
    
    Primarily, we are using the **Names** of their messaging which can contain the following information.
    
    - **Company Name:** (e.g., "2022 Printify Wrapped," "Printify Connect Survey")
    - **Personal Names:** (e.g., "Test David," "Webinar invitation- Megan," "Etsy expert series with Starla Moore")
    - **Internal Project Names:** (e.g., "Quality Bet Research/Survey," "Project Lunch," "[Project Solar] Comms")
    - **Partner/Vendor Incidents:** (e.g., "18.08.2022 - Etsy v2 incident," "02.02.2023 - Shopify incident")
    - **Financial/Pricing Details:** (e.g., "18.05.2022 - Price and shipping update," "30.09.2022 - Q4 product price update + surcharge")
    - **User Segmentation Strategy:** (e.g. `[Active]`, `[Semi-active]`, `[Churned]`, `[Orders>0]`, `[PWS & SPWS]`)
    - **Technical Issues & Operational Updates:** (e.g. 07.03.2023 - SCH API 429 incident with stores)
    - **Specific Dates & Timelines:** While individual dates are not sensitive, the aggregate data reveals the company's marketing cadence and operational timeline over several years.
    </aside>
    
    <aside>
    ⏳
    
    **Future Plans may include additional data points:**
    
    **Performance Metrics (Opens, Clicks, Conversions, ROI)** to add weight to each area of lifecycle marketing to support data-driven conversations. 
    
    *Approval to use this data can enable future updates.*
    
    </aside>
    
- **The above data-points are exported and reviewed only by the Customer Success Managers and the AI-generated insight is presented to the respective customer through secure channels. What other consideration must be in place to stay compliant?**
    - Secure channels currently being used are:
        - Zoom Meetings (Screen sharing to show the AI-generated insight)
        - Miro Board Sharing (Share settings to verified customer email addresses)
        - Email Attachment (Image shared to verified customer email addresses)
        - Google Drive (Image uploaded and link shared to verified customer email addresses)
- **Assuming that CIO compliance team is comfortable with the relative risk of customer data exposure to the Enterprise AI platform, usage of Lifecycle Atlas would be limited only to cases where explicit customer consent has been granted in writing. Note - that verbiage would have to come directly from the compliance team**

---

## Next Steps

- [x]  Review this doc with Compliance
- [x]  Identify what kind of ‘opt in’ language could be possible with the Compliance team
- [x]  Pilot Atlas with 2–3 customers under opt-in **if sign off is given**
- [ ]  Measure perceived value, follow-up actions, and strategic impact
- [ ]  Present to EPD team to explore possible appetite for ‘productising’ the approach
- [ ]  Define a potential workflow for anonymization-at-scale

---