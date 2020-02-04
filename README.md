# React Redux Ecommerce: Order Manager

This script is an extension off the [React Redux Ecommerce](https://github.com/justinkunz/react-redux-ecommerce) project, to help manage your ecommerce orders easily using Google Apps Script.

## Steps to use

1. Click [here](https://docs.google.com/spreadsheets/d/1o4GGmCNI2vc2-HwKC0HD0skH_uTP9yyQMP0GdQKcfyk/template/preview) to get a copy of the Order Manager template.
2. Go to Tools > Script Editor to open the Apps Script Script Editor. This script should already be copied there. If not, copy this script into the editor.
3. Go to File > Project properties > Script Properties and add the following content:

- `DEV_BASE_URL` - Base URL for your apps dev environment
- `PROD_BASE_URL` - Base URL for your apps prod environment
- `ADMIN_KEY` - Admin secret key for protected APIs
- `env` - (dev | prod) - Environment to run script in

4. From the Spreadsheet go to Order Manager > Sync Inventory to sync your inventory
5. Update Orders by clicking Order Manager > Update Orders
6. Highlight a row and select Order Manager > Mark as Shipped to mark an order as shipped.
