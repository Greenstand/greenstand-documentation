
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php');?>
<!-- END STANDARD PHP HEADER --------------- -->

<style>
 div#grnd p.in1.list {margin-left:30px !important;}
 div#grnd img.scrn {width:760px;border:2px solid #888;border-radius:20px;}
 div#grnd img.vert {width:200px;border:2px solid #888;border-radius:20px; float:left;display:block; margin:12px 0px 20px 0px;}
 div#grnd div.c2   {margin-left:220px !important;}
</style>

<h1>How to Record Earnings and Payments</h1>

<p>For growers and funders, Greenstand's online <a href='https://admin.treetracker.org/earnings'>Earnings</a> tool records payments due and payments made.</p>

<p>In a typical case...</p>
<p class='hang1'>1. Growers plant trees and submit <i>capture</i> records by phone.
<p class='hang1'>2. Greenstand consolidates multiple captures into a single record and calculates the earnings due for the lot.
<p class='hang1'>3. Funders download <i>earnings</i> records, make payments to growers, then upload payment data for growers to see.

<p>Contracts among growers, funders, and management organizations specify the details:</p>
<p class='list'>Whether to use the Greenstand Earnings tool.</p>
<p class='list'>How often and how many captures go into an earnings record.</p>
<p class='list'>How and how much funders pay growers.</p>

<p>This document describes how to use and understand the various parts of Greenstand's online Earnings tool.</p>
<p>You may also find help in a more-detailed, less-procedural document: the Greenstand <a href='/docs/user-guides/earningsref.php'>Earnings Reference</a>.</p>
<div class='sect' id='top'>
<div id='contents'><h2>Contents:</h2>
  <p><a href='#getearn'>Get Earnings Data</a></p>
  <p><a href='#postpay'>Post a Payment</a></p>
  <p><a href='#postpays'>Post Multiple Payments</a></p>
</div></div>

<!-- ---------------------------------------------- -->
<div class='sect' id='getearn'>
<h2>Get Earnings Data</h2>
<p><i><a href='https://admin.treetracker.org/earnings'>figure 1: Earnings administration: https://admin.treetracker.org/earnings</a></i></p>
<p><a href='https://admin.treetracker.org/earnings'><img class='scrn' src='/docs/user-guides/pix/admin-earns-760.png'/></a></p>
<p>Here is how to export a typical selection of growers' earnings data:</p>
<p class='hang1'>1. Direct your web browser to the <a href='https://admin.treetracker.org/earnings'>Earnings</a> tool and log in with the name and password you received from Greenstand.</p>
<p class='hang1'>2. Select a subset of records.</p>
<p class='in1'>Typically, you want only records that await your payment: Click on <c>Filter</c> Select <c>Payment Status</c> > <c>Calculated</c>. 
<p class='in1'>You can also select records by the name of the managing organization, a grower's name, and/or a grower's phone number.</p>
<p class='hang1'>3. Click <c>Apply</c>. The data table now shows only records that match your selection.
<p class='hang1'>4. Select records by date, if you wish: Click on <c>Date Range</c>. Enter start and end dates. Click <c>Apply</c></p>
<p class='in1'>Date selection works on the table's <c>Effective Date</c>. That is the date a given record was created.
Records are created when the number or time-span of tree captures reaches the threshold specified in the contract between 
grower and funder.</p>
<p class='hang1'>5. Copy the data to your machine: Click <c>EXPORT</c>.</p>
<p class='in1'>The data displayed in the table is saved to a local file.
  Exactly where, with what name, varies with your machine and your browser configuration.</p>
<p class='in1'>Most likely, the files automatically goes to a <c>Downloads</c> folder,
  or a prompt lets you specify a file name and location.</p>
<p class='hang1'>6. Process that data as you see fit.</p>
<p class='in1'>The file is in standart CSV format (comma-separated values). 
  That means plain text, one record per line, with values surrounded by "quotation marks" and separated by commas.
  The first line presents the field names, rather than values.</p>
<p class='in1'>You can import the file into your spreadsheet or accounting software, or read it with a text editor.</p>
<p class='in1'><i>Example exported file:</i></p>
<p class='in1 code'>"earnings_id","worker_id","phone","currency","amount","captures_count","payment_confirmation_id","payment_method","paid_at"
"b86f5e05-4277-4221-8111-d7a7cfb5da2f","3257d56f-c4a9-484f-9658-0776efe5331b","123-123-1234","SLL","200","61","","",""
"204942dd-6bcf-4445-8d82-d83645bae760","3257d56f-c4a9-484f-9658-0776efe5332b","123-123-1234","SLL","200","62","","",""
"433361ba-2f71-4f84-9d4b-4d1b75e581c9","3257d56f-c4a9-484f-9658-0776efe5333b","123-123-1234","SLL","260","63","","",""
"c9ae6b11-cecd-4f4d-800d-9772c9209cdf","3257d56f-c4a9-484f-9658-0776efe5334b","123-123-1234","SLL","320","64","","",""</p>
</div>

<!-- ---------------------------------------------- -->
<div class='sect' id='postpay'>
 <h2>Post a Payment</h2>
 <p>You can use the Earnings display to record a payment made, as follows:</p>
 <img class='vert' src='/docs/user-guides/pix/admin-earns-details.png'/>
 <div class='c2'>
  <p>&nbsp;</p>
  <p class='hang1'>1. Click on the record in question.</p>
  <p class='in1'>You see a details dialogue for that record.</p>
  <p class='hang1'>2. At the bottom of the dialogue, enter an ID and method.</p>
  <p class='in1'>The <c>Payment Confirmation ID</c> can be most any string of 
                 characters that serves your purpose.</p>
  <p class='in1'>The <c>Payment Method</c>, also a string of your choosing, 
                 describes how you paid the grower, "deposit" or "Visa" for example.</p>
  <p class='hang1'>3. Click <c>LOG PAYMENT</c>.</p>
  <p class='in1'>The dialogue closes. The <c>Status</c> of the record is now 
                 <c>Paid</c> and the <c>Payment Date</c> is today.</p>
 </div>
 <br style='clear:both'/>
</div>

<!-- ---------------------------------------------- -->
<div class='sect' id='postpays'>
 <h2>Post Multiple Payments</h2>
 <p>You can record multiple payments by uploading a file of CSV data.</p>
 <img class='vert' src='/docs/user-guides/pix/admin-menu.png'/>
 <div class='c2'>
  <p>Provide all the same fields that occur in exported earnings data, in the same order.</p>  
  <p>Write one complete record per line. Surround values with "quotation marks." Separate values with commas.</p>
  <p><u>Do</u> include the field names in line 1.</p>
  <p>Write the final value of each record, the <c>paid_at</c> date, in ISO 8601 format: <c>YYYY-MM-DD</c>.</p>
  <p>At its simplest, the process goes like this:</p>
  <p class='hang1'>1. Export a file of Greenstand earnings data, as described a href='#getearn'>above</a>.</p>
  <p class='hang1'>2. Edit the file to supply the three values missing from end each record: </p>
  <p class='in1 list'><c>payment_confirmation_id</c>: Most any string of characters that serves your purpose.</p>
  <p class='in1 list'><c>payment_method</c>: A string of characters that describes 
                      how you paid the grower, "deposit" or "Visa" for example.</p>
  <p class='in1 list'><c>paid_at</c>: The date you made the payment, in the format <c>YYYY-MM-DD</c>.</p>
  <p class='hang1'>3. Save the file.</p>
  <p class='hang1'>4. Go to the Payments table in the Greenstand administration panel: 
           <a href='https://test-admin.treetracker.org/payments'><c>https://admin.treetracker.org/payments</c></p>
  <p class='in1'>To get there, change the URL in the browser or navigate the Greenstand panel's menu.</p>
  <p class='hang1'>5. Click <c>UPLOAD</c>. Then select your file.</p>
  <p class='in1'>If all goes well, the message reads <c>Data Uploaded Successfully</c>, 
                 and the updated records display in the Payments table.</p>
 </div>
 <br style='clear:both'/>
 <p class='in1'><i>Example of file to upload:</i></p>
<p class='in1 code'>"earnings_id","worker_id","phone","currency","amount","captures_count","payment_confirmation_id","payment_method","paid_at"
"b86f5e05-4277-4221-8111-d7a7cfb5da2f","3257d56f-c4a9-484f-9658-0776efe5331b","123-123-1234","SLL","200","61","payID01","Visa","2022-04-05"
"433361ba-2f71-4f84-9d4b-4d1b75e581c9","3257d56f-c4a9-484f-9658-0776efe5333b","123-123-1234","SLL","260","63","payID02","Visa","2022-04-05"
"c9ae6b11-cecd-4f4d-800d-9772c9209cdf","3257d56f-c4a9-484f-9658-0776efe5334b","123-123-1234","SLL","320","64","payID03","Visa","2022-04-05"</p>
</div>

<!-- STANDARD PHP FOOTER --------------- -->
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/south.php');?>
