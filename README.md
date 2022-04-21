# GreenDocs

Documentation, how-to, guides, references for Greenstand and its Treetracker software.

This repo populates ```https://greenstand.org/docs/```.
That website is the central, reliable, up-to-date directory to Greenstand documentation.

The repo files in ```./greenorg/docs``` deploy to ```https://greenstand.org/docs/```
Repo files outside of ```./greenorg/docs``` are only there to support local installation and development.

```./greenorg/docs/*index.php``` files provide annotated lists of links.
Those links point to Greenstand documentation at most any accessible address, 
typically ```greenstand.org```, Greenstand's gitbook, and Greenstand's github.

## Contributing

To seek a change or clarification, please submit an issue.

To create or change a documentation file:

1. Fork the repo and clone it locally.

2. Edit files in ```./greenorg/docs```
   Or copy and rename ```./greenorg/docs/aparts/template.php```

3. Create a pull request.

## Formatting files:

Documentation content gets written in HTML.
The files are named ```*.php``` and begin and end with PHP code.
```/greenorg/docs/aparts/template.php``` explains: 
```
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php');?>
<!-- END STANDARD PHP HEADER --------------- -->
Copy and rename this file to a subdirectory of greenorg/docs.
Put your content here.
<pre>If you don't know HTML, write plain text
between two &lt;pre> &lt;/pre> tags.</pre>

For details about the style sheet, see 
https://greenstand.org/docs/aparts/greendoc.htm

<!-- STANDARD PHP FOOTER --------------- -->
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/south.php');?>
```
## Environment:

```https://greenstand.org/docs/``` depends on ```*.php``` files to provide 
the headers and footers that are standard to ```https://greenstand.org```

This repo provides a ```node.js``` server for local development purposes.

Using PHP on node.js is an odd arrangement. 
The node.js server cannot process PHP.
Instead, it reads the PHP files and copies HTML code from them.

If you have a better idea, please let us know. Submit an issue.

## Local Installation:

The local installation is tested on Linux Ubuntu. 
If you discover problems on other platforms, please submit an issue.

1. Fork the repo from ```https://github.com/Greenstand/greenstand-documentation```
   to your own github repo.

2. Clone your repo to your local machine.

3. Copy ```config.example.json``` to ```config.json```
   Edit it to suit your local environment.

4. Run ```npm install``` and ```npm start```

## Authorization: 

Any file or directory with a name that includes an \_underscore\_
is private and password-protected.

The password is in the file ```https://greenstand.org/docs/aparts/greendoc.php```
That file is **not** part of this repo.
To change the password, you need read-write access to that server's file system.

To get the password, ask Greenstand via Slack.

While some of the documents are private, the descriptions and links in the index files
are not private. 

Privacy and authorization are responsibilities of whatever system hosts a given document. 

--end--


