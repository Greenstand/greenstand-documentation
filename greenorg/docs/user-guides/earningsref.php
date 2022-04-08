
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php');?>
<!-- END STANDARD PHP HEADER --------------- -->
<h1>Greenstand Earnings Reference</h1>

<p>For growers and funders, Greenstand's online <a href='https://admin.treetracker.org/earnings'>Earnings</a> tool records payments due and payments made.</p>

<p>This document describes the control elements and data fields displayed in the Earnings tool.</p>

<p>If the Earnings tool is new to you, you might find helpful the less-detailed, more procedural <a href='/docs/user-guides/earningshow.php'>How to Record Earnings and Payments</a></p>

<!-- ---------------------------------------------- -->
<div class='sect' id='top'>
<div id='contents'><h2>Contents:</h2>
  <p><a href='#cols'>Data Table Columns</a></p>
  <p><a href='#dtls'>Record Details</a></p>
  <p><a href='#exps'>Export/Import Fields</a></p>
  <p><a href='#iface'>User Interface Controls</a></p>
</div></div>

<style>
 div#grnd p.in1.list {margin-left:30px !important;}
 div#grnd img.scrn {width:760px;border:2px solid #888;border-radius:20px;}
 div#grnd img.vert {width:200px;border:2px solid #888;border-radius:20px; float:left;display:block; margin:12px 0px 20px 0px;}
 div#grnd div.c2   {margin-left:220px !important;}
</style>

<!-- ---------------------------------------------- -->
<div class='sect' id='cols'>
<h2>Data Table Columns</h2>
<p>The Earnings table and Payments table provide the same columns of data, with one exception: Payments > Payment Method.</p>
<p><b>Grower</b>: Person who plants and tends trees, submits <i>captures</i> to a Greenstand account, and receives payments.</p>
<p><b>Funder</b>: Person or institution who pays for tree captures.</p>
<p id='amt'><b>Amount</b>: The quantity of money the funder pays for the group of tree captures represented by an earnings record. That amount is agreed to by contracts with growers and calculated when the record is created.</p>
<p id='cnt'><b>Capture Count</b>: A capture is a data object created by a grower. The <i>capture count</i> is the number of captures represented by the earnings record. That number varies, depending on contract specifications.</p>
<p><b>Effective Date</b>: The date the earnings record was created. Records are created automatically on specified time intervals, or when a grower's accumulating tree captures reach a specified threshold. Details of intervals and thresholds vary with individual contracts.</p>
<p id='mtd'><b>Payment Method</b>: The payer's description of how payment moved from funder to grower. This field appears in the Payment table only, not in the Earnings table.</p>
<p><b>Status</b>: An earnings record may be in one of three states:</p>
<p class='list'><b>Calculated</b>: The earnings record was created and the payment due determined as specified by contract. No payment is recorded yet.</p>
<p class='list'><b>Paid</b>: Payment has been made and confirmed, and the record updated with this tool.</p>
<p class='list'><b>Cancelled</b>: To allow for errors, Greenstand administrators can cancel an earnings record.</p>
<p>The Earnings table can list records in all three states. The Payments table lists only <i>paid</i> records.</p>
<p id='pdt'><b>Payment Date</b>: The date a single payment was confirmed via the Earnings > Details tool.
  Or the date specified in data uploaded via the Payments table. In uploads, the dates must be in ISO 8601 format: <c>YYYY-MM-DD</c>.</p>
</div>

<!-- ---------------------------------------------- -->
<div class='sect' id='dtls'>
<h2>Record Details</h2>
<p><u>In addition</u> to the table fields described <a href='#cols'>above</a>, the Details include these fields:</p>
<p><b>Organization</b>: In some cases, a third party works to manage relations between multiple growers and funders.</p>
<p id='rid'><b>Record ID</b>: A unique identifier for the earnings record. It is created automatically by the database software.</p>
<p><b>Consolidation Type</b>: Contracts specify precisely how and when captures are grouped together, or <i>consolidated</i>
 for an earnings record. This field gives a name to those specifications.</p>
<p><b>Start Date</b> &amp; <b>End Date</b>: The date of the earliest and latest tree capture object grouped into this record.</p>
<p><b>Payment Confirmed by</b>: The user ID of the person who used this tool to confirm a payment.</p>
<p><b>Payment Confirmation Method</b>:</p>
<p class='list'><b>single</b>: Payment was confirmed separately for this one record with the Earnings > Details tool.</p>
<p class='list'><b>batch</b>: Payment was confirmed by uploading a CSV file via the Payments table.</p>
<p id='pid'><b>Payment Confirmation ID</b>: A string of characters provided by the user who confirmed the payment.</p>
</div>

<!-- ---------------------------------------------- -->
<div class='sect' id='exps'>
<h2>Export/Import Fields</h2>
<p>When you export a set of records from the Earnings table, the first line of the file lists the field names described below.</p>
<p>Values in uploaded data must represent the same fields, in the same order.</p>
<p>Write one record per line. Separate values with commas. Normal practice is to surround values with quotation marks. 
Use full quotation marks: <c>"value"</c>, never single quotes: <c>'value'</c>. If no values include commas, the quotation marks are not necessary.
<p><b>earnings_id</b>: See <a href='#rid'>Record ID</a>, above.</p> 
<p><b>worker_id</b>: A unique identifier for a grower.</p>
<p><b>phone</b>: Another unique identifier for a grower.</p>
<p><b>currency</b>: The species of money agreed to for payments.</p>
<p><b>amount</b>: See <a href='#amt'>Amount</a>, above.</p>
<p><b>captures_count</b>: See <a href='#cnt'>Capture Count</a>, above.</p>
<p><b>payment_confirmation_id</b>: See <a href='#pid'>Payment Confirmation ID</a>, above.</p>
<p><b>payment_method</b>: See <a href='#mtd'>Payment Method</a>, above.</p>
<p><b>paid_at</b>: A <u>date</u>; see <a href='#pdt'>Payment Date</a>, above.</p>

<p><i>Example of file to upload</i></p>
<p class=' code'>"earnings_id","worker_id","phone","currency","amount","captures_count","payment_confirmation_id","payment_method","paid_at"
"b86f5e05-4277-4221-8111-d7a7cfb5da2f","3257d56f-c4a9-484f-9658-0776efe5331b","123-123-1234","SLL","200","61","payID01","Visa","2022-04-05"
"433361ba-2f71-4f84-9d4b-4d1b75e581c9","3257d56f-c4a9-484f-9658-0776efe5333b","123-123-1234","SLL","260","63","payID02","Visa","2022-04-05"
"c9ae6b11-cecd-4f4d-800d-9772c9209cdf","3257d56f-c4a9-484f-9658-0776efe5334b","123-123-1234","SLL","320","64","payID03","Visa","2022-04-05"</p>
</div>

<!-- ---------------------------------------------- -->
<div class='sect' id='iface'>
<h2>User Interface Controls</h2>
<p><b>EXPORT</b>: Save to a file on your machine the records now selected in the Earnings table. The export will include records selected but not displayed on the current page of the table.</p>
<p><b>UPLOAD</b>: Send a file of updated records to the Greenstand database.</p>
<p><b>Date Range, Start Date, End Date</b>: Select records by their <i>Effective Date</i>. The earliest records
  in the table will be from the Start Date or later. The latest records will from on or before the End Date.</p>
<p><b>Filter</b>: Select records to display in the table by...</p>
<p class='in1'><b>Payment Status</b>: Display records in all states, records awaiting payment (<i>calculated</i>), or records already <i>paid</i>.</p>
<p class='in1'>This filter is for the Earnings table only. The Payments table displays <i>paid</i> records only.<p>
<p class='in1'><b>Organization</b>: To limit the table to growers managed by a single organization, select its name.</p>
<p class='in1'><b>Grower Phone Number, Name</b>: To limit the table to a single grower, enter all or part of a phone number or name. If you enter both number and name, the filter selects by name only. It ignores the phone number.</p>
<p><b>&#x25B2; &#x25BC;</b>: Some of the column headings include a sort icon. Click on the column heading to 
  alphabetize table rows in ascending &#x25B2; or descending &#x25BC; order. The sort applies to all the selected
  records, not just those on the current page.</p>
<p><b>Rows per page &#x25BC; &lt; &gt;</b>: Not all selected records are necessarily displayed. Use this control to 
  change the number of rows per page of table, and to move from one page to another.</p>
</div>

<p id='end'><a href='#grnd'>^ back to top ^</a></p>
<!-- STANDARD PHP FOOTER --------------- -->
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/south.php');?>
