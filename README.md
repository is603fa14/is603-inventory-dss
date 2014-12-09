Inventory Management Decision Support System
============================================

This application allows retail managers to review information about their 
inventory, and determine what prodcuts to order, and how many products to 
order.

This application is being developed as part of a project for 
[IS 603](http://informationsystems.umbc.edu/home/graduate-programs/graduate-course-listing/is-603-decision-technology-systems-credits-3/)
at [UMBC](http://www.umbc.edu).


Environment
------------

This project has several dependencies for development: 

  - [VirtualBox](https://www.virtualbox.org/wiki/Downloads) v.4.3.18
  - [Vagrant](https://www.vagrantup.com/downloads.html) v. 1.6.3
  - [Git](http://git-scm.com/downloads)

The development environment itself is configured using Vagrant, which 
automatically creates a virtual machine, and sets it up for development.  It 
is compatible with most common host operating systems (Windows, Linux, 
Mac OS X).

In this documentation, _host_ refers to the primary machine's operating 
system, and _guest_ refers to the Vagrant virtual machine.

The following ports are forwarded from the host machine to the guest machine:

  - `localhost:3000` is forwarded to the Node.js Express.js application 
     (when running)

**Note**: an alternative to using Vagrant and a virtual machine is to 
simply install Node.js on the host operating system, and run the 
application directly on the machine.  To do so, 
[download](http://nodejs.org/download/) and install Node.js, and 
then following the [First-time Set-up](#first-time-set-up) procedure,
skipping steps 3-5.


First-time Set-up
-----------------

Complete these procedure using a terminal window in the host machine.  On 
Windows hosts, it may be necessary to use the "Git bash" program, included 
with "Git for Windows".

  1.	Clone the project repository on the host machine: 
  	`https://github.com/thierer1/is603-inventory-dss.git`.
  
  2.    Navigate to the project directory:
        `cd is603-inventory-dss`.

  3.	Set-up the guest VM using Vagrant: 
  	`vagrant up`.

	This may take several minutes to set-up.  The first time, Vagrant will 
	attempt to download the base box, and then provision necessary software 
	onto the box.  

  4.	SSH into the guest VM: 
	`vagrant ssh`.

  5.	Navigate to the project directory:
	`cd /vagrant`.

	The `/vagrant` directory is linked to the project directory on the 
	host machine.  This allows you to make code changes on the host 
	machine, and they will automatically be made in the guest machine 
	as well. 

  6.	Install Node.js dependencies:
	`npm install`.

  7.	Start the application:
	`node bin/www`.

  8.	Using a browser on the host machine, navigate to:
	`http://localhost:3000`.

	You should see the application homepage. 


Development
-----------

On the host machine: 

  - `vagrant up`: starts the VM
  - `vagrant halt`: stops the VM
  - `vagrant suspend`: puts the VM to sleep
  - `vagrant status`: reports the status of the VM (started or stopped)
  - `vagrant provision`: re-provisions the VM without impacting any files; this 
  	will make sure that the machine is properly configured

On the guest machine: 

  - `node bin/www` (from the `/vagrant` directory) will start the Node.js 
    application.  This must be done every time the code changes.  Use 
    `ctrl+c` to stop the application while running.

All code changes should be made on the host machine using an IDE or code 
editor of choice.

All version control should be handled using Git on the **host machine**.  
(Using Git on the guest machine may create problems with tracking code 
changes.)


Generating Data
---------------

All data is maintained in the `data` directory.  

Data is maintained in a Microsoft Excel spreadsheet.  The application expects 
the data in an XML format for processing.  Therefore, it is necessary to 
transform the data from Excel to XML.  This is done using the following 
procedure:

  1.  Define an XML Schema for the Excel format; this schema will not match 
      the final schema, but will act as an intermediary data format. 
  2.  Map the Excel data to the schema using the procedure 
      [here](http://office.microsoft.com/en-us/excel-help/add-map-and-unmap-xml-elements-HP001041933.aspx).
  3.  Export the Excel data to XML using the procedure 
      [here](http://office.microsoft.com/en-us/excel-help/export-xml-data-HP010206401.aspx#BM1).
  4.  Transform the XML data from Excel into the expected data format using
      XSLT.

Steps 1-2 only need to be performed on **new** spreadsheets; if changes are 
made to the existing spreadsheets, then all that is needed is to re-export
the data from Excel, and transform using XSLT.  

  1.  To re-export the data:
    1.  Open the Excel spreadsheet
    
    2.  In the "Developer" tab on the ribbon, click "Export" in the "XML"
        section.  (If the Developer tab is not visible, follow 
        [these instructions](http://msdn.microsoft.com/en-us/library/bb608625.aspx)).

    3.  Save the file in the `data` directory as `inventoryData_excel.xml`.
  2.  To transform the data:
    1.  Open a terminal/command prompt, and navigate to the `data` directory.
    
    2.  Use Saxon to perform the transformation:
    	  ```
        java -jar saxon9he.jar -s:inventoryData_excel.xml -xsl:inventoryData_excel.xsl -o:inventoryData.xml
        ```

        The Saxon command for the replacement data:
        ```
        java -jar saxon9he.jar -s:replacementData_excel.xml -xsl:inventoryData_excel.xsl -o:replacementData.xml
        ```

This will output the transformed data to `data/inventoryData.xml`.  

(Note: this process requires a [Java](https://www.java.com/en/) executable to 
be on the PATH.)


Third-Party Software
--------------------

This project makes use of several open source tools, including
the following:

  - [Express JS](http://expressjs.com/): a Sinatra-style web framework for Node.js.
  - [Handlebars](http://handlebarsjs.com/): a templating engine.
  - [Bootstrap](http://getbootstrap.com/): a front-end CSS framework.
  - [jQuery](http://jquery.com/) and [jQuery UI](http://jqueryui.com/): JavaScript libraries. 
  - [AM Charts](http://www.amcharts.com/javascript-charts/): a JavaScript library for easily creating graphs.
  - [XML2JS](https://github.com/Leonidas-from-XIV/node-xml2js): a library for reading XML into JavaScript objects.

Additional dependencies are included in the `package.json` file.
