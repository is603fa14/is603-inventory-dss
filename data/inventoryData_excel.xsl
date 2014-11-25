<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xlsData="http://is.umbc.edu/is603/inventory/excelData inventoryData_excel.xsd"
  xmlns="http://is.umbc.edu/is603/inventory/productData inventoryData.xsd">
  <xsl:output method="xml" indent="yes" />

  <xsl:template match="xlsData:product">
    <xsl:variable name="product" select="." />
    <xsl:variable name="numWeeks" select="count(./xlsData:week)" />
    <product type="candy">
      <xsl:attribute name="name">
        <xsl:value-of select="./xlsData:name" />
      </xsl:attribute>
      <description>
        <xsl:value-of select="./xlsData:description" />
      </description>
      <retailPrice>
        <xsl:value-of select="./xlsData:retailPrice" />
      </retailPrice>
      <margin><!-- TODO --></margin>
      <inventory>
        <xsl:value-of select="./xlsData:inventory" />
      </inventory>
      <xsl:choose>
        <xsl:when test="$numWeeks &gt; 0">
          <xsl:for-each select="1 to 20">
            <xsl:variable name="index" select="position()" />
            <xsl:variable name="weekName" select="concat('week', $index)" />
            <xsl:variable name="promotion" select="$product/xlsData:currentPromotion/child::text()" />
            <week>
              <xsl:attribute name="id">
                <xsl:value-of select="21 - $index" />
              </xsl:attribute>
              <xsl:if test="$promotion != '' and $index &lt; 5">
                <xsl:attribute name="promo">
                  <xsl:value-of select="true()" />
                </xsl:attribute>
              </xsl:if>
              <qty><xsl:value-of select="$product//*[local-name()=$weekName]/child::text()" /></qty>
              <mkavg><xsl:value-of select="$product/xlsData:marketAPS" /></mkavg>
              <nos><xsl:value-of select="$product/xlsData:numStores" /></nos>
            </week>
          </xsl:for-each>
        </xsl:when>
        <xsl:otherwise>
          <mkavg><xsl:value-of select="./xlsData:marketAPS" /></mkavg>
          <nos><xsl:value-of select="./xlsData:numStores" /></nos>
        </xsl:otherwise>
      </xsl:choose>
    </product>
  </xsl:template>

  <xsl:template match="/">
    <products>
      <xsl:apply-templates />
    </products>
  </xsl:template>
</xsl:stylesheet>