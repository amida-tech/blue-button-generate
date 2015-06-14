# blue-button-generate.js Release Notes

# v.1.5.0 - June 14, 2015
- Separate race and ethnicity from blue-button is now supported.
- Support for input data only is removed.  Your input now must have both data and meta components.
- Set Identifier and Confidentiality Code are now read from  CCDA JSON meta properties.
- Add preventNullFlavor option to generateCCD
- Refactored humand readable section generation (HTML)

# v.1.4.0 - March 25, 2105
- Results of xsi:type ST are now supported
- Medication supply organization is now supported
- Text fields are added for results, encounters, medications, allergies
- Providers are added to the CCDA header
- Each entry can be given a unique id based on an option

# v.1.3.0 - December 12, 2014
- Seperated from blue-button repository.'
- Rewritten using a new infrastructure with JSON templates.
- Full compare tests with source xml and generated xml are added.
- Browser support using browserify.
- Added to bower.
- Bug fixes.
