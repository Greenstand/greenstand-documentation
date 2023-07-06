---
title: Earnings Reference
layout: default
parent: User Guides
nav_order: 2
---


Greenstand Earnings Reference
================================================

{% last_modified_at %}

For growers and funders, Greenstand's online [Earnings tool](https://admin.treetracker.org/earnings) records payments due and payments made.

This document describes the control elements and data fields displayed in the Earnings tool.

If the Earnings tool is new to you, you might find helpful the less-detailed, more procedural
[How to Record Earnings and Payments](earningshow.md)

#### Contents:

- [Data Table Columns](#data-table-columns)

- [Record Details](#record-details)

- [Export-Import Fields](#export-import-fields)

- [User Interface Controls](#user-interface-controls)

## Data Table Columns

The Earnings table and Payments table provide the same columns of data, with one exception: Payments > Payment Method.

**Grower**: Person who plants and tends trees, submits *captures* to a Greenstand account, and receives payments.

**Funder**: Person or institution who pays for tree captures.

**Amount**: The quantity of money the funder pays for the group of tree captures represented by an earnings record. That amount is agreed to by contracts with growers and calculated when the record is created.

**Capture Count**: A capture is a data object created by a grower. The *capture count* is the number of captures represented by the earnings record. That number varies, depending on contract specifications.

**Effective Date**: The date the earnings record was created. Records are created automatically on specified time intervals, or when a grower's accumulating tree captures reach a specified threshold. Details of intervals and thresholds vary with individual contracts.

**Payment Method**: The payer's description of how payment moved from funder to grower. This field appears in the Payment table only, not in the Earnings table.

**Status**: An earnings record may be in one of three states:

- **Calculated**: The earnings record was created and the payment due determined as specified by contract. No payment is recorded yet.

- **Paid**: Payment has been made and confirmed, and the record updated with this tool.

- **Cancelled**: To allow for errors, Greenstand administrators can cancel an earnings record.

The Earnings table can list records in all three states. The Payments table lists only *paid* records.

**Payment Date**: The date a single payment was confirmed via the Earnings > Details tool.
  Or the date specified in data uploaded via the Payments table. In uploads, the dates must be in ISO 8601 format: `YYYY-MM-DD`.

## Record Details
In <ins>addition</ins> to the table fields described above, the details include these fields:

**Organization**: In some cases, a third party works to manage relations between multiple growers and funders.

**Record ID**: A unique identifier for the earnings record. It is created automatically by the database software.

**Consolidation Type**: Contracts specify precisely how and when captures are grouped together, or *consolidated* for an earnings record. This field gives a name to those specifications.

**Start Date** & **End Date**: The date of the earliest and latest tree capture object grouped into this record.

**Payment Confirmed by**: The user ID of the person who used this tool to confirm a payment.

**Payment Confirmation Method**:

- **single**: Payment was confirmed separately for this one record with the Earnings > Details tool.

- **batch**: Payment was confirmed by uploading a CSV file via the Payments table.

**Payment Confirmation ID**: A string of characters provided by the user who confirmed the payment.

## Export-Import Fields

When you export a set of records from the Earnings table, the first line of the file lists the field names described below.

Values in uploaded data must represent the same fields, in the same order.

Write one record per line. Separate values with commas. Normal practice is to surround values with quotation marks. 

Use full quotation marks: `"value"`, never single quotes: `'value'`. If no values include commas, the quotation marks are not necessary.

**earnings_id**: See *Record ID*, above.
 
**worker_id**: A unique identifier for a grower.

**phone**: Another unique identifier for a grower.

**currency**: The species of money agreed to for payments.

**amount**: See *Amount*, above.

**captures_count**: See *Capture Count*, above.

**payment_confirmation_id**: See *Payment Confirmation ID*, above.

**payment_method**: See *Payment Method*, above.

**paid_at**: A <ins>date</ins>; see *Payment Date*, above.

*Example of file to upload*

```
"earnings_id","worker_id","phone","currency","amount","captures_count","payment_confirmation_id","payment_method","paid_at"
"b86f5e05-4277-4221-8111-d7a7cfb5da2f","3257d56f-c4a9-484f-9658-0776efe5331b","123-123-1234","SLL","200","61","payID01","Visa","2022-04-05"
"433361ba-2f71-4f84-9d4b-4d1b75e581c9","3257d56f-c4a9-484f-9658-0776efe5333b","123-123-1234","SLL","260","63","payID02","Visa","2022-04-05"
"c9ae6b11-cecd-4f4d-800d-9772c9209cdf","3257d56f-c4a9-484f-9658-0776efe5334b","123-123-1234","SLL","320","64","payID03","Visa","2022-04-05"
```
## User Interface Controls

**EXPORT**: Save to a file on your machine the records now selected in the Earnings table. The export will include records selected but not displayed on the current page of the table.

**UPLOAD**: Send a file of updated records to the Greenstand database.

**Date Range, Start Date, End Date**: Select records by their *Effective Date*. The earliest records in the table will be from the Start Date or later. The latest records will from on or before the End Date.

**Filter**: Select records to display in the table by...

> **Payment Status**: Display records in all states, records awaiting payment (*calculated*), or records already *paid*.

>> This filter is for the Earnings table only. The Payments table displays *paid* records only.

> **Organization**: To limit the table to growers managed by a single organization, select its name.

> **Grower Phone Number, Name**: To limit the table to a single grower, enter all or part of a phone number or name. If you enter both number and name, the filter selects by name only. It ignores the phone number.

**&#x25B2; &#x25BC;**: Some of the column headings include a sort icon. Click on the column heading to alphabetize table rows in ascending &#x25B2; or descending &#x25BC; order. The sort applies to all the selected records, not just those on the current page.

**Rows per page &#x25BC; &lt; &gt;**: Not all selected records are necessarily displayed. Use this control to change the number of rows per page of table, and to move from one page to another.

