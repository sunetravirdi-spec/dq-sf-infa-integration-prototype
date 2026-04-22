# Informatica integration of Data Quality \- Version 2

# Introduction

Data quality in Informatica is the backbone of data management. This capability ties data catalog, data integration, data governance, and master data management together. Data Quality enables data admins, architects and data engineers to understand the shape (profile) of their data, cleanse and correct data through DQ rules, applying business logic, and transform/observe data into a quality bar that meets the organization’s standards. Data quality has 3 main pillars.

1. **Discovery & Baseline (Data Profiling)** \- Every high-value customer insight begins with a "Lab Test." Through native Data Profiling, customers gain immediate transparency into the hidden patterns and flaws within their raw data.  
     
2. **The Action Phase (Data Quality)** \- With the baseline established, Data Quality acts as the automated "Enforcement" layer, assessing, cleansing, standardizing, and enriching data in real-time.  
     
3. **The Reliability Layer (Data Observability)** \- Data Observability serves as the continuous "Hospital Monitor," providing end-to-end visibility to catch anomalies before they impact the business.

Customer problem and value proposition

### 2.1 The Problem Today

**Data Cloud customers face a trust gap:**

- Identity Resolution produces match rates with an xx% gap due to unstandardized contact data  
- Segmentation queries return incomplete results due to nulls, duplicates, and inconsistent formats  
- Agentic Query/Metadata Search produces poor results when underlying data quality is unknown  
- Data engineers spend xx+ hours/week manually profiling CRM data in external tools  
- No visibility into data quality issues until downstream processes fail

**Current workarounds are painful:**

- Connect SF data to external DQ tools for validation  
- Manually profile data in Jupyter notebooks or SQL queries  
- Build custom validation logic in transforms (not reusable)  
- React to quality issues post-failure instead of preventing them

### 2.2 The Solution: Native DQ Integration

**What we're building:** A unified Data Cloud experience where customers can profile, validate, and monitor data quality without leaving the platform—powered by Informatica's enterprise-grade DQ engine.

**Why it matters:**

- **For Data Engineers:** See DQ scores in-context while building DMO pipelines, catch issues before IR runs  
- **For Data Analysts:** Trust that segmentation queries are built on complete, accurate data

### MVP Scope

#### High level goals

| Title | Description | Phasing | Impact |
| :---- | :---- | :---- | :---- |
| **Existing customers of INFA \+ Salesforce D360**  | **Existing customers of INFA \+ Salesforce D360** can view their profiling results and DQ scores from a single pane of glass in D360 | Phase 0 | Low |
| **Customers of data 360 NEW to INFA** | **Customers of data 360 NEW to INFA** can view profile states and run recommended  DQ rules and scores from the D360 | Phase 1 | High |

#### Assumption:

* Data quality capability in D360, uses DQ rule engine from INFA  
* Phase 1 is focused on data at rest   
* The capability uses DQ headless agent

#### Scope for Goal 1: I can statements

* As a marketer I can view the Data Quality Score on my DMOs, DLOs and CIs in the catalog  
* As a marketer I can view Data Quality Score and Profiling stats in my objects from my flow of work

#### Scope for Goal 2: I can statements

* I can view Data Profiling results from Salesforce Catalog for all objects with source as CRM  
* I can view recommended Data Quality rules that apply to specific columns of my DMOs, based on profiling stats.   
* I can schedule a DQ rule in one-click from the Catalog  
* Once the DQ rule is run, I can view overall score by dimension and DQ score for each DMO within the catalog  
* I can view DQ score within my flow of work as well  
* \[Recommend remediation\] I can remediate quality of my data based on failed records stored in D360

#### Out of scope

* Data Quality on data in motion \[Data integration and pipeline\]  
* Cross table validation and lookup rules  
* Complex rules that require to look at multiple DMOs  
* Schedules that are custom (every other day run or weekly)

#### Data 360 setup and data connection

* Complete SaaS-ification and obfuscation of setup and auth steps.  
  * Customer using D360, already has D360 with connection built in, do we need to authenticate IDMC again?   
* The connection set up means DQ rule engine from   
* Or a 1 click setup agent

#### Data 360 profiling discovery and exploration

* **Data Aware Specialist role** in D360 and Catalog invokes a skill to generate appropriate Data Profiling rules on the DMO/DLO/CI

Requirements

* Enable Claire powered GPT to access lakehouse table, using user authentication/MCP  
* Enable on the fly selection of data profiling rules on the data  
* ~~Enable setup permission from the user~~  
* Identify the critical elements on which profiling can be run  
* Provide guideline that the profiling rules will only run on 10K (TBD) rows of data  
* Provide feedback that profile scores will show up in xx hours  
  * One time/adhoc run \- P0  
    * Used mainly to discover the data  
  * Regular batch job \- P1

#### Data 360 rules curation/generation in Catalog

There are 4 types of rules inputs:

* Prompt based  
* Known structures based \- like US passport  
* Rules based on business logic in a google sheet etc.  
* Rules based on reading the data and metadata \- through profiling and catalog  
* Manual DQ rules in the DQ application

* **Data Aware Specialist role** can view the profiling results  
  * This can be enabled from Catalog \[Phase 1\]  
* Auto-Invoke skill to recommend DQ rules.   
  *  “Recommend a set of rules on my DMO xyz”  
* Invoke skill to set up of DQ rule in the DQ app in Data 360  
* Example: Generate DQ score based on not nulls  
* Example: Apply a cleansing rule of age, if DOB is provided.

#### Data 360 score consumption

* **Marketers, Data aware specialists** can view the DQ score posted in   
  * Salesforce Catalog  
  * Flow of work  
* Data Aware Specialist can view the list of rule issues/violations  
* Data Aware Specialists can invoke skill to get recommendations to fix the issues.

