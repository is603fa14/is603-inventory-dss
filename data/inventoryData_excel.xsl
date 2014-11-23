<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xlsData="http://is.umbc.edu/is603/inventory/excelData inventoryData_excel.xsd"
  xmlns="http://is.umbc.edu/is603/inventory/productData inventoryData.xsd">
  <xsl:output method="xml" indent="yes" />

  <xsl:template match="xlsData:product">
    <xsl:variable name="product" select="." />
    <product type="candy">
      <xsl:attribute name="name">
        <xsl:value-of select="./xlsData:description" />
      </xsl:attribute>
      <retailPrice><!-- TODO figure out --></retailPrice>
      <margin><!-- TODO figure out --></margin>
      <xsl:for-each select="1 to 20">
        <xsl:variable name="index" select="position()" />
        <xsl:variable name="weekName" select="concat('week', $index)" />
        <week>
          <xsl:attribute name="id">
            <xsl:value-of select="$index" />
          </xsl:attribute>
          <qty><xsl:value-of select="$product//*[local-name()=$weekName]/child::text()" /></qty>
          <mkavg><xsl:value-of select="$product/xlsData:marketAPS" /></mkavg>
          <nos><xsl:value-of select="$product/xlsData:numStores" /></nos>
        </week>
      </xsl:for-each>
    </product>
  </xsl:template>

  <xsl:template match="/">
    <inventory>
      <xsl:apply-templates />
    </inventory>
  </xsl:template>
</xsl:stylesheet>