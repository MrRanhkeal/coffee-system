import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        language: 'Language',
        english: 'English',
        khmer: 'Khmer',
        chinese: 'Chinese',
        logout: 'Logout',
        no_data: 'No data',
        all: 'All',
        yes: 'Yes',
        no: 'No',
        close: 'Close',
        cancel: 'Cancel',
        save: 'Save',
        update: 'Update',
        view: 'View',
        new: 'New',
        search: 'Search',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        image: 'Image',
        action: 'Action',
        number: 'No',
        price: 'Price',
        discount: 'Discount',
        description: 'Description',
        brand: 'Brand',
        category: 'Category',
        product_name: 'Product Name',
        profile: 'Profile',
        currency: 'Currency',
        setting: 'Setting',
        hotdrink: 'Hot Drink',
        print: 'Print',
        filter: 'Filter'
      },
      app: {
        title: 'POS Management',
        brand: 'V-Friend Coffee'
      },
      menu: {
        dashboard: 'Dashboard',
        pos: 'POS',
        product: 'Product',
        category: 'Category',
        customer: 'Customer',
        order: 'Order',
        supplier: 'Supplier',
        expense: 'Expense',
        stock: 'Stock',
        stock_coffee: 'Stock Coffee',
        report: 'Report',
        getsalereport: 'Sales Report',
        sale_summary: 'Sale Summary',
        users_group: 'General Users',
        user: 'User',
        role: 'Role',
        setting: 'Setting',
        currency: 'Currency'
      },
      //login
      login: {
        title: 'LOGIN',
        titles: 'LOGIN',
        username: 'Username',
        password: 'Password',
        remember: 'Remember me',
        submit: 'LOGIN',
        success: 'Login success!',
        failed: 'Login failed. Please try again.',
        error: 'An Error connection to server. Please check your connection...!'
      },
      validation: {
        username_required: 'Please input your email!',
        password_required: 'Please input your password!',
        product_name_required: 'Please input product name!',
        brand_required: 'Please select brand!',
        category_required: 'Please select category!',
        status_required: 'Please select a status!',
        customer_name_required: 'Please input customer name!',
        phone_required: 'Please input phone number!',
        email_required: 'Please input email!',
        email_invalid: 'Please enter a valid email!'
      },
      //products
      product: {
        total_count: 'Total products {{count}}',
        labels: {
          name: 'Product Name',
          brand: 'Brand',
          discount: 'Discount',
          category: 'Category',
          price: 'Price',
          status: 'Status',
          description: 'Description',
          image: 'Image'
        },
        placeholders: {
          name: 'Enter product name',
          brand: 'Select brand',
          discount: 'Discount',
          category: 'Select category',
          price: 'Price',
          status: 'Select status',
          description: 'Description'
        },
        table: {
          no: 'No',
          name: 'Product Name',
          description: 'Description',
          category: 'Category',
          brand: 'Brand',
          price: 'Price',
          discount: 'Discount',
          status: 'Status',
          image: 'Image',
          action: 'Action'
        },
        confirm: {
          delete_title: 'Delete {{name}}',
          delete_content: 'Are you sure you want to delete {{name}}?'
        }
      },
      //orders
      order: {
        title: 'Order Table',
        labels: {
          order_no: 'Order No',
          order_date: 'Order Date',
          customer: 'Customer',
          total_amount: 'Total Amount',
          paid_amount: 'Paid Amount',
          pay_back: 'Pay Back',
          status: 'Status',
          payment_method: 'Payment Method',
          remark: 'Remark',
          cashier: 'Cashier',
          created_at: 'Created At',
          updated_at: 'Updated At',
          action: 'Action',
          detail: 'Detail',
          payment_status: 'Payment Status',
          product: 'Product',
          p_category_name: 'Category Name',
          p_image: 'Image',
          sugar_level: 'Sugar Level',
          qty: 'Qty',
          price: 'Price',
          discount: 'Discount',
          total: 'Total',
          filter: 'Filter',
          orders: 'Order',
          total_orders: 'Total Order',
          bong: 'Bong'
        },
        placeholders: {
          order_date: 'Select order date',
          customer: 'Select customer',
          total_amount: 'Total Amount',
          paid_amount: 'Paid Amount',
          pay_back: 'Pay Back',
          status: 'Select status'
        },
        table: {
          no: 'No',
          order_no: 'Order No',
          order_date: 'Order Date',
          customer: 'Customer',
          total_amount: 'Total Amount',
          paid_amount: 'Paid Amount',
          pay_back: 'Pay Back',
          status: 'Status',
          action: 'Action',
          created_at: 'Created At',
          updated_at: 'Updated At',
          detail: 'Detail',
          payment_status: 'Payment Status',
          payment_method: 'Payment Method',
          remark: 'Remark',
          cashier: 'Cashier',
          product: 'Product',
          p_category_name: 'Category Name',
          p_image: 'Image',
          sugar_level: 'Sugar Level',
          qty: 'Qty',
          price: 'Price',
          discount: 'Discount',
          total: 'Total',
          filter: 'Filter',
          orders: 'Order',
          total_orders: 'Total Order',
          bong: 'Bong'
        },
        modal: {
          new: 'Create Order',
          view: 'View Order'
        },
        confirm: {
          delete_title: 'Delete Order #{{id}}',
          delete_content: 'Are you sure you want to delete Order #{{id}}?'
        }
      },
      //categories
      category: {
        title: 'Category Table',
        labels: {
          name: 'Category Name',
          description: 'Description',
          status: 'Status',
          hot_drink: 'Hot Drink',
        },
        placeholders: {
          name: 'Enter category name',
          description: 'Description',
        },
        table: {
          no: 'No',
          name: 'Name',
          description: 'Description',
          status: 'Status',
          action: 'Action'
        },
        confirm: {
          delete_title: 'Delete {{name}}',
          delete_content: 'Are you sure you want to delete {{name}}?'
        }
      },
      //exchange
      exchange:{
        title: 'Exchange Table',
        labels: {
          ex:'Exchange', 
          amount: 'Amount',
          exchange_rate: 'Exchange Rate', 
          usd: 'USD',
          khr: 'KHR', 
          clear: 'Clear',
        },
        placeholders: {
          amount: 'Enter Amount',
          exchange_rate: 'Enter Exchange Rate',
          usd: 'Input USD',
          khr: 'Input KHR',
        },
        table: { 
          ex:'Exchange', 
          amount: 'Amount',
          exchange_rate: 'Exchange Rate', 
          usd: 'USD',
          khr: 'KHR', 
          clear: 'Clear',
        },
      },
      //customers
      customer: {
        title: 'Customer Table',
        labels: {
          name: 'Customer Name',
          phone: 'Phone',
          email: 'Email',
          address: 'Address',
          description: 'Description',
          status: 'Status',
        },
        placeholders: {
          name: 'Enter customer name',
          phone: 'Enter phone number',
          email: 'Enter email',
          address: 'Enter address',
          description: 'Description',
          status: 'Select status'
        },
        table: {
          no: 'No',
          name: 'Name',
          phone: 'Phone',
          email: 'Contact',
          address: 'Address',
          description: 'Description',
          status: 'Status',
          action: 'Action',

        },
        modal: {
          new: 'Create Customer',
          view: 'View'
        },
        confirm: {
          delete_title: 'Delete {{name}}',
          delete_content: 'Are you sure you want to delete {{name}}?'
        }
      },
      //suppliers
      supplier: {
        title: 'Supplier Table',
        labels: {
          name: 'Supplier Name',
          phone: 'Phone',
          email: 'Email', 
          supplier_address: 'Address',
          description: 'Description',
          status: 'Status',
          action: 'Action',
          created_at: 'Created At',
          updated_at: 'Updated At'
        },
        placeholders: {
          name: 'Enter supplier name',
          phone: 'Enter phone number',
          email: 'Enter email',
          supplier_address: 'Enter address',
          description: 'Description',
          status: 'Select status'
        },
        table: {
          no: 'No',
          name: 'Name',
          phone: 'Phone',
          email: 'Contact',
          supplier_address: 'Address',
          description: 'Description',
          status: 'Status',
          action: 'Action',

        },
        modal: {
          new: 'Create Supplier',
          view: 'View'
        },
        confirm: {
          delete_title: 'Delete {{name}}',
          delete_content: 'Are you sure you want to delete {{name}}?'
        } 
      },
      //expenses
      expense: {
        title: 'Expense Table',
      labels: {
          name: 'Expense',
          expensetype: 'Expense Type',
          amount: 'Amount',
          vendorpayee: 'Vendor/Payee',
          paymentmethod: 'Payment Method',
          expense_date: 'Expense Date', 
          description: 'Description',
          status: 'Status',
          action: 'Action',
          created_at: 'Created At',
          created_by: 'Created By',
          updated_at: 'Updated At',
          lastmonth:' Last Month',
          thismonth:' This Month',
          thisyear:' This Year',
          totalexpense:' Total Expense',
        },
        placeholders: {
          name: 'Enter expense name',
          amount: 'Enter amount',
          vendorpayee: 'Select vendor/payee',
          paymentmethod: 'Select payment method',
          expense_date: 'Select expense date',
          description: 'Description',
          status: 'Select status'
        },
        table: {
          no: 'No',
          name: 'Name',
          expensetype: 'Expense Type',
          amount: 'Amount',
          vendorpayee: 'Vendor/Payee',
          paymentmethod: 'Payment Method',
          expense_date: 'Expense Date',
          description: 'Description',
          status: 'Status',
          action: 'Action',
          created_at: 'Created At',
          created_by: 'Created By',
          updated_at: 'Updated At',
          lastmonth:' Last Month',
          thismonth:' This Month',
          thisyear:' This Year',
          totalexpense:' Total Expense',
        },
        modal: {
          new: 'Create Expense',
          view: 'View'
        },
        confirm: {
          delete_title: 'Delete {{name}}',
          delete_content: 'Are you sure you want to delete {{name}}?'
        } 
      },
      //stocks
      stock: {
        title: 'Stock Table',
        labels: {
          name: 'Product Name',
          producttype: 'Product Type',
          supplier: 'Supplier',
          qtyinstock:'Quantity in stock',
          newqty:'New Quantity',
          expenseKg:'Expense/kg',
          total_expense:' Total Expense',
          description:'Description',
          note:'note',
          stocktype: 'Stock Type',
          coffee: 'Coffee',
          others:'Others',
          otherstock:' Other Stock',
          stockcoffee:' Stock Coffee',
          totalexpense:' Total Expense',
          product: 'Product',
          category: 'Category',
          quantity: 'Quantity',
          status: 'Status',
          action: 'Action',
          created_at: 'Created At',
          updated_at: 'Updated At', 
          brand:'Brand'
        },
        placeholders: {
          product: 'Select product',
          supplier: 'Select supplier',
          stocktype: 'Select stock type',
          category: 'Select category',
          quantity: 'Enter quantity',
          status: 'Select status',
          description: 'Description',
          note: 'Note',
          brand:'Select brand'

        },
        table: {
          no: 'No',
          name: 'Product Name',
          producttype: 'Product Type',
          stocktype: 'Stock Type',
          supplier: 'Supplier',
          qtyinstock:'Quantity in stock',
          newqty:'New Quantity',
          expenseKg: 'Expense/kg',
          total_expense: ' Total Expense',
          description: 'Description',
          note: 'note',
          coffee: 'Coffee',
          totalexpense:' Total Expense',
          others:'Others',
          otherstock:' Other Stock',
          stockcoffee:' Stock Coffee',
          product: 'Product',
          category: 'Category',
          quantity: 'Quantity',
          status: 'Status',
          action: 'Action', 
          brand:'Brand'
        },
        modal: {
          new: 'Create Stock',
          view: 'View'
        },
        confirm: {
          delete_title: 'Delete stock of {{name}}',
          delete_content: 'Are you sure you want to delete stock of {{name}}?'
        } 
      },
      //users
      user: {
        title: 'User Table',
        labels: {
          name: 'Full Name',
          username: 'Username', 
          role: 'Role',
          status: 'Status',
          password: 'Password',
          confirm_password: 'Confirm Password',
          create_by: 'Create By',
        },
        placeholders: {
          name: 'Enter full name',
          username: 'Enter username',
          email: 'Enter email',
          role: 'Select role',
          status: 'Select status',
          password: 'Enter password',
          confirm_password: 'Confirm password',
          create_by: 'Create By',
        },
        table: {
          no: 'No',
          name: 'Full Name',
          username: 'Username',
          email: 'Email', 
          role: 'Role',
          status: 'Status',
          action: 'Action',
          create_by: 'Create By',
        },
        modal: {
          new: 'Create User',
          view: 'View'
        },
        confirm: {
          delete_title: 'Delete {{name}}',
          delete_content: 'Are you sure you want to delete {{name}}?',
          confirm_delete_content: 'Are you sure you want to delete {{name}}?',
          delete_success: 'Delete user {{name}} success!',
          delete_failed: 'Delete user {{name}} failed!',
        }
      },
      //roles
      role: {
        title: 'Role Table',
        labels: {
          name: 'Role Name',
          description: 'Description',
          status: 'Status',
          permission: 'Permission',
          all: 'All',
        },
        placeholders: {
          name: 'Enter role name',
          description: 'Description',
          status: 'Select status'
        },
        table: {
          no: 'No',
          name: 'Name',
          permission: 'Permission',
          description: 'Description',
          all: 'All',
          status: 'Status',
          action: 'Action'
        },
        confirm: {
          delete_title: 'Delete {{name}}',
          delete_content: 'Are you sure you want to delete {{name}}?'
        }
      },
      //pos
      pos: {
        title: 'POS',
        labels: {
          paymentsuccess: 'Payment successful',
          qrexpire: 'QR expired',
          expirein: 'Expires in',
          makeassprint: 'Mark as Paid & Print',
          categorie: 'categories',
          notfound:'No products found',
          second:'second'
        }, 
        table: {
          paymentsuccess: 'Payment successful',
          qrexpire: 'QR expired',
          expirein: 'Expires in',
          makeassprint: 'Mark as Paid & Print',
          categorie: 'categories',
          notfound:'No products found',
          second:'second'
        }, 
      },
      //cart
      cart: {
        title: 'Cart',
        labels: {
          clear: 'Clear', 
          emty: 'Empty',
          totalamoun: 'Total Amount',
          qty: 'Qty',
          total:'Total',
          price: 'Price',
          discount: 'Discount',
          items: 'Items',
          customer: 'Customer',
          paymentmethod:'Payment Method',
          remark: 'Remark',
          paidamount:'Paid Amount',
          payback:'Pay Back',
          neededamount:'Amount to be paid',
          more:'More',
          click:'Click',
          qrpay:'Qr Payment KHQR',
          cart:'Cart',
          cash: 'សាច់ប្រាក់'
        },
        placeholders: {
          customer: 'Please select customer', 
          paymentmethod: 'Please select payment method'
        },
        table: {
          clear: 'Clear',
          emty: 'Empty',
          totalamoun: 'Total Amount',
          qty: 'Qty',
          total: 'Total',
          price: 'Price',
          discount: 'Discount',
          items: 'Items',
          customer: 'Customer',
          paymentmethod: 'Payment Method',
          remark: 'Remark',
          paidamount: 'Paid Amount',
          payback: 'Pay Back',
          neededamount: 'Amount to be paid',
          more: 'More',
          click: 'Click',
          qrpay: 'Qr Payment KHQR',
          cart: 'Cart',
          cash: 'សាច់ប្រាក់'
        }
      },
      //bilitems
      billItem: {
        title: 'Bill Items',
        labels: {
          sugarlevel: 'Sugar', 
        },
        table: {
          sugarlevel: 'Sugar', 
        },
      },
      //productitem
      productItem: {
        title: 'Product Item',
        labels: {
          onecup:'1 Cup',
          choosesugar:'Choice of Sugar Levels',
          choseone: 'Choice 1',
          sugar0: 'sugar 0%',
          sugar10: 'sugar 10%',
          sugar25: 'sugar 25%',
          sugar50: 'sugar 50%',
          sugar75: 'sugar 75%', 
          sugar100: 'sugar 100%', 
          addtocart: 'Add to Cart',
          price:'Price',
          needed:'Needed',
          free:'Free'
        },
        table: {
          onecup: '1 Cup',
          choosesugar: 'Choice of Sugar Levels',
          choseone: 'Choice 1',
          sugar0: 'sugar 0%',
          sugar10: 'sugar 10%',
          sugar25: 'sugar 25%',
          sugar50: 'sugar 50%',
          sugar75: 'sugar 75%',
          sugar100: 'sugar 100%',
          addtocart: 'Add to Cart',
          price: 'Price',
          needed: 'Needed',
          free: 'Free'
        }
      },
      //invoices
      invoice: {
        title: 'Invoice',
        labels: {
          paymentsuccess: 'Payment successful',
          qrexpire: 'QR expired',
          expirein: 'Expires in',
        },
        table: {
        }
      },
      //dashboard
      dashboard: {
        title: 'Dashboard',
        labels: {
          categories: 'Categories',
          customers: 'Customers',
          orders: 'Orders',
          products: 'Products',
          revenues: 'Total Revenues',
          orverviews: 'Overviews',
        },
        table: {
          categories: 'Categories',
          customers: 'Customers',
          orders: 'Orders',
          products: 'Products',
          revenues: 'Total Revenues',
          orverviews: 'Overviews',
        }
      },
      //recentorders
      recentorders: {
        title: 'Recent Orders',
        labels: {
          recentorders: 'Recent Orders',
          orderno: 'Order No',
          total: 'Total',
          paidamount: 'Paid Amount',
          paymentmethod: 'Payment Method',
          cashier: 'Cashier',
          datetime: 'Date time',
        },
        table: {
          recentorders: 'Recent Orders',
          orderno: 'Order No',
          total: 'Total',
          paidamount: 'Paid Amount',
          paymentmethod: 'Payment Method',
          cashier: 'Cashier',
          datetime: 'Date time',
        }
      },
      //reports
      report: {
        title: 'Reports',
        labels: {
          fromdate: 'From Date',
          todate: 'To Date',
          filter: 'Filter',
          orderno: 'Order No',
          orderdate: 'Order Date',
          customer: 'Customer',
          cashier: 'Cashier',
          productname: 'Product Name',
          qty:' Qty',
          price: 'Price',
          discount: 'Discount',
          brand: 'Brand',
          total: 'Total', 
          salereport:'Sale Reports',
          loadingchart:'Loading Chart...',
          year:'Year',
          month:'Month',
          jan:'Jan',
          feb:'Feb',
          mar:'Mar',
          apr:'Apr',
          may:'May',
          jun:'Jun',
          jul:'Jul', 
          aug:'Aug',
          sep:'Sep',
          oct:'Oct',
          nov:'Nov',
          dec:'Dec',
          lastmonth:'Last Month',
          lastweek:'Last Week',
          thismonth:'This Month',
          thisweek:'This Week',
          thisyear:'This Year',
          today:'Today',
          salethismonth:'Sale This Month',
          orderthismonth:'Order This Month',
          bong:'Bong',
          analysispermoth:'Analysis Per Month',
          nodata:'No data available',
          nodatatoshow:'No sales data available to display charts'
        },
        table: {
          fromdate: 'From Date',
          todate: 'To Date',
          filter: 'Filter',
          orderno: 'Order No',
          orderdate: 'Order Date',
          customer: 'Customer',
          cashier: 'Cashier',
          productname: 'Product Name',
          qty:' Qty',
          price: 'Price',
          discount: 'Discount',
          brand: 'Brand',
          total: 'Total', 
          salereport:'Sale Reports',
          loadingchart: 'Loading Chart...',
          year: 'Year',
          month: 'Month',
          jan: 'Jan',
          feb: 'Feb',
          mar: 'Mar',
          apr: 'Apr',
          may: 'May',
          jun: 'Jun',
          jul: 'Jul',
          aug: 'Aug',
          sep: 'Sep',
          oct: 'Oct',
          nov: 'Nov',
          dec: 'Dec',
          lastmonth: 'Last Month',
          lastweek: 'Last Week',
          thismonth: 'This Month',
          thisweek: 'This Week',
          thisyear: 'This Year',
          today: 'Today',
          salethismonth: 'Sale This Month',
          orderthismonth: 'Order This Month',
          bong: 'Bong',
          analysispermoth: 'Analysis Per Month',
          nodata: 'No data available',
          nodatatoshow: 'No sales data available to display charts'
        }
      },
    }
  },
  kh: {
    translation: {
      common: {
        language: 'ភាសា',
        english: 'អង់គ្លេស', 
        khmer: 'ខ្មែរ',
        chinese: 'ចិន',
        logout: 'ចាកចេញ',
        no_data: 'មិនមានទិន្នន័យ',
        all: 'ទាំងអស់',
        yes: 'បាទ/ចាស',
        no: 'ទេ!',
        close: 'បិទ',
        cancel: 'បោះបង់',
        save: 'រក្សាទុក',
        update: 'កែប្រែ',
        view: 'មើល',
        new: 'បញ្ចូលថ្មី',
        search: 'ស្វែងរក',
        status: 'ស្ថានភាព',
        active: 'សកម្ម',
        inactive: 'អសកម្ម',
        image: 'រូបភាព',
        action: 'សកម្មភាព',
        number: 'ល.រ',
        price: 'តម្លៃលក់',
        discount: 'បញ្ចុះតម្លៃ',
        description: 'ពណ៌នា',
        brand: 'ម៉ាក/Brand',
        category: 'ប្រភេទទំនិញ',
        product_name: 'ឈ្មោះទំនិញ',
        profile: 'ប្រវត្តិរូប',
        currency: 'ប្ដូរប្រាក់',
        setting: 'កំណត់',
        hotdrink: 'ភេសជ្ជៈក្ដៅ',
        print: 'បោះពុម្ព',
        filter: 'តម្រង'
      },
      app: {
        title: 'ប្រព័ន្ធគ្រប់គ្រង និងការលក់',
        brand: 'V-Friend ការហ្វេ'
      },
      menu: {
        dashboard: 'ទំព័រដើម',
        pos: 'កាលក់',
        product: 'ទំនិញ',
        category: 'ប្រភេទទំនិញ',
        customer: 'អតិថិជន',
        order: 'ការបញ្ចារទិញ',
        supplier: 'អ្នកផ្គត់ផ្គង់',
        expense: 'ការចំណាយ',
        stock: 'ស្តុក',
        stock_coffee: 'ស្តុកកាហ្វេ',
        report: 'របាយការណ៍',
        getsalereport: 'របាយការណ៍នៃការលក់',
        sale_summary: 'របាយការណ៍លំអិតការលក់',
        users_group: 'អ្នកប្រើប្រាស់ទូទៅ',
        user: 'អ្នកប្រើប្រាស់',
        role: 'សិទ្ធិប្រើប្រាស់',
        setting: 'កំណត់',
        currency: 'ប្ដូរប្រាក់'
      },
      //login
      login: {
        title: 'ចូល', 
        titles: 'LOGIN',
        username: 'ឈ្មោះអ្នកប្រើ',
        password: 'ពាក្យសម្ងាត់',
        remember: 'ចងចាំខ្ញុំ',
        submit: 'ចូល',
        success: 'Login ជោគជ័យ!',
        failed: 'ការចូលបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។',
        error: 'កំហុសតភ្ជាប់ទៅម៉ាស៊ីនមេ។ សូមព្យាយាមម្ដងទៀត។'
      },
      validation: {
        username_required: 'សូមបញ្ចូលអុីម៉ែលអ្នកប្រើប្រាស់ !',
        password_required: 'សូមបញ្ចូលពាក្យសម្ងាត់ !',
        product_name_required: 'សូមបញ្ចូលឈ្មោះទំនិញ!',
        brand_required: 'សូមបញ្ចូលម៉ាក/Brand!',
        category_required: 'សូមបញ្ចូលប្រភេទទំនិញ',
        status_required: 'សូមជ្រើសរើស ស្ថានភាព!',
        customer_name_required: 'សូមបញ្ចូល ឈ្មោះអតិថិជន!',
        phone_required: 'សូមបញ្ចូល លេខទូរស័ព្ទ!',
        email_required: 'សូមបញ្ចូល អ៊ីម៉ែល!',
        email_invalid: 'សូមបញ្ចូល អ៊ីម៉ែល ដែលត្រឹមត្រូវ!'
      },
      //products
      product: {
        total_count: 'ចំនួនផលិតផល {{count}}',
        labels: {
          name: 'ឈ្មោះទំនិញ',
          brand: 'ម៉ាក/Brand',
          discount: 'បញ្ចុះតម្លៃ',
          category: 'ប្រភេទទំនិញ',
          price: 'តម្លៃលក់',
          status: 'ស្ថានភាព',
          description: 'ពណ៌នា',
          image: 'រូបភាព'
        },
        placeholders: {
          name: 'បញ្ចូលឈ្មោះទំនិញ',
          brand: 'ជ្រើសរើសម៉ាក/Brand',
          discount: 'បញ្ចុះតម្លៃ',
          category: 'ជ្រើសរើសប្រភេទទំនិញ',
          price: 'តម្លៃលក់',
          status: 'ជ្រើសរើសស្ថានភាព',
          description: 'ពណ៌នា'
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោះទំនិញ',
          description: 'ពណ៌នា',
          category: 'ប្រភេទទំនិញ',
          brand: 'ម៉ាក/Brand',
          price: 'តម្លៃលក់',
          discount: 'បញ្ជុះតម្លៃ',
          status: 'ស្ថានភាព',
          image: 'រូបភាព',
          action: 'សកម្មភាព'
        },
        confirm: {
          delete_title: 'លុប {{name}}',
          delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?'
        }
      },
      //orders
      order: {
        title: 'ការបញ្ចារទិញ',
        labels: {
          order_date: 'ថ្ងៃខែឆ្នាំ',
          order_no: 'លេខបញ្ជារទិញ',
          customer: 'អតិថិជន',
          total_amount: 'ចំនួនទឹកប្រាក់សរុប',
          payment_status: 'ស្ថានភាពការទូទាត់',
          created_at: 'ថ្ងៃខែឆ្នាំ',
          updated_at: 'ថ្ងៃខែឆ្នាំ',
          action: 'សកម្មភាព',
          cashier: 'អ្នកលក់',
          remark: 'កំណត់សម្គាល់',
          paid_amount: 'ចំនួនប្រាក់ដែលបានបង់',
          pay_back: 'បង់ត្រឡប់',
          status: 'ស្ថានភាព',
          payment_method: 'វិធីសាស្ត្រ ការទូទាត់',
          detail: 'លំអិត', 
          product: 'ទំនិញ',
          p_category_name: 'ឈ្មោះប្រភេទទំនិញ',
          p_image: 'រូបភាព',
          sugar_level: 'កម្រិតស្ករ',
          qty: 'បរិមាណ',
          price: 'តម្លៃលក់',
          discount: 'បញ្ចុះតម្លៃ',
          total: 'សរុប',
          filter: 'តម្រង',
          orders: 'ការបញ្ចារទិញ',
          total_orders: 'សរុប',
          bong: 'បុង'

        },
        table:{
          no: 'ល.រ',
          order_no: 'លេខបញ្ជារទិញ',
          order_date: 'ថ្ងៃខែឆ្នាំ',
          customer: 'អតិថិជន',
          total_amount: 'ចំនួនទឹកប្រាក់សរុប',
          payment_status: 'ស្ថានភាពការទូទាត់',
          created_at: 'ថ្ងៃខែឆ្នាំ',
          updated_at: 'ថ្ងៃខែឆ្នាំ',
          action: 'សកម្មភាព',
          cashier: 'អ្នកលក់',
          remark: 'កំណត់សម្គាល់',
          paid_amount: 'ចំនួនប្រាក់ដែលបានបង់',
          pay_back: 'បង់ត្រឡប់',
          status: 'ស្ថានភាព',
          payment_method: 'វិធីសាស្ត្រ ការទូទាត់',
          detail: 'លំអិត', 
          product: 'ទំនិញ',
          p_category_name: 'ឈ្មោះប្រភេទទំនិញ',
          p_image: 'រូបភាព',
          sugar_level: 'កម្រិតស្ករ',
          qty: 'បរិមាណ',
          price: 'តម្លៃលក់',
          discount: 'បញ្ចុះតម្លៃ',
          total: 'សរុប',
          filter: 'តម្រង',
          orders: 'ការបញ្ចារទិញ',
          total_orders: 'សរុប',
          bong: 'បុង'

        }
      },
      //categories
      category: {
        title: 'តារាងប្រភេទទំនិញ',
        labels: {
          name: 'ឈ្មោះប្រភេទទំនិញ',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
          hot_drink: 'ភេសជ្ជៈក្ដៅ',
        },
        placeholders: {
          name: 'បញ្ចូល ឈ្មោះប្រភេទទំនិញ',
          description: 'ពណ៌នា',
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោះ',
          description: 'ការពណ៌នា',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',
          
        },
        confirm: {
          delete_title: 'លុប {{name}}',
          delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?'
        }
      },
      //exchange
      exchange:{
        title: 'ប្ដូរប្រាក់',
        labels: {
          ex:'អត្រាប្ដូរប្រាក់', 
          amount: 'ចំនួនប្រាក់',
          exchange_rate: 'អត្រាប្ដូរប្រាក់', 
          usd: 'ប្រាក់ដុល្លារ',
          khr: 'ប្រាក់រៀល', 
          clear: 'សម្អាត',
        },
        placeholders: {
          amount: 'បញ្ចូល ចំនួនប្រាក់',
          exchange_rate: 'បញ្ចូលអត្រាប្ដូរ',
          usd: 'បញ្ចូល ប្រាក់ដុល្លារ',
          khr: 'បញ្ចូល ប្រាក់រៀល',
        },
        table: { 
          ex:'អត្រាប្ដូរប្រាក់', 
          amount: 'ចំនួនប្រាក់',
          exchange_rate: 'អត្រាប្ដូរប្រាក់', 
          usd: 'ប្រាក់ដុល្លារ',
          khr: 'ប្រាក់រៀល', 
          clear: 'សម្អាត',
        },
      },
      //customers
      customer: {
        title: 'តារាងអតិថិជន',
        labels: {
          no: 'ល.រ',
          name: 'ឈ្មោះអតិថិជន',
          phone: 'លេខទូរស័ព្ទ',
          email: 'អ៊ីម៉ែល',
          address: 'ទីកន្លែង',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
          hotdrink: 'ភេសជ្ជៈក្ដៅ',
        },
        placeholders: {
          name: 'បញ្ចូល ឈ្មោះអតិថិជន',
          phone: 'បញ្ចូល លេខទូរស័ព្ទ',
          email: 'បញ្ចូល អ៊ីម៉ែល',
          address: 'បញ្ចូល ទីកន្លែង',
          description: 'ពណ៌នា',
          status: 'ជ្រើសរើស្ថានភាព'
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោរ',
          phone: 'លេខទូរស័ព្ទ',
          email: 'ទំនាក់ទំនង',
          address: 'ទីកន្លែង',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព'
        },
        modal: {
          new: 'បញ្ចូលអតិថិជន',
          view: 'មើល'
        },
        confirm: {
          delete_title: 'លុប {{name}}',
          delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?'
        }
      },
      //suppliers
      supplier: {
        title: 'តារាងអ្នកផ្គត់ផ្គង់',
        labels: {
          name: 'ឈ្មោះអ្នកផ្គត់ផ្គង់',
          phone: 'លេខទូរស័ព្ទ',
          email: 'អ៊ីម៉ែល', 
          supplier_address: 'ទីកន្លែង',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',
          created_at: 'ថ្ងៃខែឆ្នាំ',
          updated_at: 'ថ្ងៃខែឆ្នាំ'
        },
        placeholders: {
          name: 'បញ្ចូល ឈ្មោះអ្នកផ្គត់ផ្គង់',
          phone: 'បញ្ចូលលេខទូរស័ព្ទ',
          email: 'បញ្ចូល អ៊ីម៉ែល',
          supplier_address: 'ទីកន្លែង',
          description: 'ពណ៌នា',
          status: 'ជ្រើសរើស្ថានភាព',
          action: 'សកម្មភាព',
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោះ',
          phone: 'លេខទូរស័ព្ទ',
          email: 'អ៊ីម៉ែល',
          supplier_address: 'ទីកន្លែង',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',

        },
        modal: {
          new: 'Create Supplier',
          view: 'View'
        },
        confirm: {
          delete_title: 'លុប {{name}}',
          delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?',
          confirm_delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?',
        }
      },
      //expenses
      expense: {
        title: 'តារាងការចំណាយ',
      labels: {
          name: 'ការចំណាយ',
          expensetype: 'ប្រភេទការចំណាយ',
          amount: 'ចំនួនប្រាក់',
          vendorpayee: 'អ្នកផ្គត់ផ្គង់/អ្នកទទួល',
          paymentmethod: 'វិធីសាស្ត្រ ការទូទាត់',
          expense_date: 'ថ្ងៃខែឆ្នាំ',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',
          created_at: 'ថ្ងៃខែឆ្នាំ',
          created_by: 'អ្នកបង្កើត',
          updated_at: 'ថ្ងៃខែឆ្នាំ',
          lastmonth:'ការចំណាយខែមុន',
          thismonth:'ការចំណាយខែនេះ',
          thisyear:'ការចំណាយឆ្នាំនេះ',
          totalexpense:' ចំនួនការចំណាយ',
        },
        placeholders: {
          name: 'បញ្ចូល ឈ្មោះការចំណាយ',
          amount: 'បញ្ចូល ចំនួនប្រាក់',
          paymentmethod: 'ជ្រើសរើស វិធីសាស្ត្រ ការទូទាត់',
          expense_date: 'ជ្រើសរើស ថ្ងៃខែឆ្នាំ',
          description: 'ពណ៌នា',
          status: 'ជ្រើសរើស្ថានភាព'
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោះ',
          expensetype: 'ប្រភេទការចំណាយ',
          amount: 'ចំនួនប្រាក់',
          vendorpayee: 'អ្នកផ្គត់ផ្គង់/អ្នកទទួល',
          paymentmethod: 'វិធីសាស្ត្រ ការទូទាត់',
          expense_date: 'ថ្ងៃខែឆ្នាំ',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',
          created_at: 'ថ្ងៃខែឆ្នាំ',
          created_by: 'អ្នកបង្កើត',
          updated_at: 'ការចំណាយថ្ងៃខែឆ្នាំ',
          lastmonth:' ការចំណាយខែមុន',
          thismonth:' ការចំណាយខែនេះ',
          thisyear:' ការចំណាយឆ្នាំនេះ',
          totalexpense:' ការចំណាយសរុប',
        },
        modal: {
          new: 'Create Expense',
          view: 'View'
        },
        confirm: {
          delete_title: 'លុប {{name}}',
          delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?',
          confirm_delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?',
        }
      },
      //stocks
      stock: {
        title: 'តារាងស្តុក',
        labels: {
          name: 'ឈ្មោះទំនិញ',
          producttype: 'ប្រភេទទំនិញ',
          supplier: 'អ្នកផ្គត់ផ្គង់',
          stocktype: 'ប្រភេទស្តុកទំនិញ',
          qtyinstock: 'ចំនួនក្នុងស្តុក',
          newqty: 'ចំនួនថ្មី',
          expenseKg: 'ចណាយ/kg',
          total_expense: 'ចំណាយសរុប',
          note: 'សម្គាល់',
          totalexpense:' ការចំណាយសរុប',
          product: 'ទំនិញ',
          coffee: 'កាហ្វេ',
          stockcoffee: 'ស្តុកកាហ្វេ',
          others: 'ផ្សេងៗ',
          otherstock: 'ស្តុកផ្សេង',
          category: 'ប្រភេទទំនិញ',
          quantity: 'បរិមាណ',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',
          created_at: 'ថ្ងៃខែឆ្នាំ',
          updated_at: 'ថ្ងៃខែឆ្នាំ',
          description: 'ពណ៌នា',
          brand: 'ម៉ាក/Brand',
        },
        placeholders: {
          product: 'ជ្រើសរើសទំនិញ',
          category: 'ជ្រើសរើសប្រភេទទំនិញ',
          stocktype: 'ជ្រើសរើសប្រភេទស្តុកទំនិញ',
          supplier: 'ជ្រើសរើសអ្នកផ្គត់ផ្គង់',
          quantity: 'បញ្ចូល បរិមាណ',
          status: 'ជ្រើសរើស្ថានភាព',
          description: 'ពណ៌នា',
          brand: 'ជ្រើសរើសម៉ាក/Brand',
          newqty: 'បញ្ចូល ចំនួនថ្មី',
          qtyinstock: 'បញ្ចូល ចំនួនក្នុងស្តុក',
          expenseKg: 'បញ្ចូល ចណាយ/kg',
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោះទំនិញ',
          producttype: 'ប្រភេទទំនិញ',
          supplier: 'អ្នកផ្គត់ផ្គង់',
          qtyinstock: 'ចំនួនក្នុងស្តុក',
          newqty: 'ចំនួនថ្មី',
          expenseKg: 'ចណាយ/kg',
          total_expense: 'ចំណាយសរុប',
          note: 'សម្គាល់',
          stocktype: 'ប្រភេទស្តុកទំនិញ',
          product: 'ទំនិញ',
          orther:'ផ្សេងៗ',
          otherstock:'ស្តុកផ្សេង',
          coffee:'កាហ្វេ',
          category: 'ប្រភេទទំនិញ',
          stockcoffee:'ស្តុកកាហ្វេ',
          totalexpense:'ការចំណាយសរុប', 
          quantity: 'បរិមាណ',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',
          description: 'ពណ៌នា', 
          brand: 'ម៉ាក/Brand',
        },
        modal: {
          new: 'Create Stock',
          view: 'View'
        },
        confirm: {
          delete_title: 'លុបស្តុក {{name}}',
          delete_content: 'តើអ្នកចង់លុបស្តុក {{name}} មែនទេ ?',
          confirm_delete_content: 'តើអ្នកចង់លុបស្តុក {{name}} មែនទេ ?',
        }
      },
      //users
      user: {
        title: 'តារាងអ្នកប្រើប្រាស់',
        labels: {
          name: 'ឈ្មោះពេញ',
          username: 'ឈ្មោះអ្នកប្រើប្រាស់', 
          role: 'តួនាទី',
          status: 'ស្ថានភាព',
          password: 'ពាក្យសម្ងាត់',
          confirm_password: 'បញ្ជាក់ពាក្យសម្ងាត់',
          create_by: 'អ្នកបង្កើត',
        },
        placeholders: {
          name: 'បញ្ចូល ឈ្មោះពេញ',
          username: 'បញ្ចូល ឈ្មោះអ្នកប្រើប្រាស់',
          email: 'បញ្ចូល អ៊ីម៉ែល',
          role: 'ជ្រើសរើស តួនាទី',
          status: 'Select status',
          password: 'បញ្ចូល ពាក្យសម្ងាត់',
          confirm_password: 'បញ្ជាក់ ពាក្យសម្ងាត់',
          create_by: 'អ្នកបង្កើត',
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោះព',
          username: 'ឈ្មោះអ្នកប្រើប្រាស់',
          email: 'អ៊ីម៉ែល', 
          role: 'តួនាទី',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព',
          create_by: 'អ្នកបង្កើត',
        },
        modal: {
          new: 'Create User',
          view: 'View'
        },
        confirm: {
          delete_title: 'លុប {{name}}',
          delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?',
          confirm_delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?',
          delete_success: 'លុបអ្នកប្រើប្រាស់ {{name}} សម្រេច!',
          delete_failed: 'លុបអ្នកប្រើប្រាស់ {{name}} មិនសម្រេច!',
        }
      },
      //roles
      role: {
        title: 'តារាងតួនាទី',
        labels: {
          name: 'ឈ្មោះតួនាទី',
          permission: 'សិទ្ធិប្រើប្រាស់',
          all: 'ទាំងអស់',
          description: 'ពណ៌នា',
          status: 'ស្ថានភាព',
        },
        placeholders: {
          name: 'បញ្ចូល ឈ្មោះតួនាទី',
          permission: 'ជ្រើសរើស សិទ្ធិប្រើប្រាស់',
          description: 'ពណ៌នា',
          status: 'ជ្រើសរើស្ថានភាព'
        },
        table: {
          no: 'ល.រ',
          name: 'ឈ្មោះ',
          description: 'ការពណ៌នា',
          permission: 'សិទ្ធិប្រើប្រាស់',
          all: 'ទាំងអស់',
          status: 'ស្ថានភាព',
          action: 'សកម្មភាព'
        },
        confirm: {
          delete_title: 'លុប {{name}}',
          delete_content: 'តើអ្នកចង់លុប {{name}} មែនទេ ?'
        }
      },
      //pos
      pos: {
        title: 'POS',
        labels: {
          paymentsuccess: 'ប្រតិបត្តិការជោគជ័យ',
          qrexpire: 'QR ផុតកំណត់',
          expirein: 'រយៈពេលកំណត់',
          makeassprint: 'បញ្ជាក់បានបង់ បោះពុម្ព',
          categorie: 'ប្រភេទទំនិញ',
          notfound:'គ្មានទិន្នន័យ',
          second:'វិនាទី'
        
        }, 
        table: {
          paymentsuccess: 'ប្រតិបត្តិការជោគជ័យ',
          qrexpire: 'QR ផុតកំណត់',
          expirein: 'រយៈពេលកំណត់',
          makeassprint: 'បញ្ជាក់បានបង់ & បោះពុម្ព',
          categorie: 'ប្រភេទទំនិញ',
          notfound:'គ្មានទិន្នន័យ',
          second:'វិនាទី'
        }
      }, 
      //cart
      cart: {
        title: 'Cart',
        labels: {
          clear: 'សម្អាត',
          emty: 'ទទេ',
          totalamoun: 'ប្រាក់សរុប',
          qty: 'ចំនួន',
          total: 'សរុប',
          price: 'តម្លៃ',
          discount: 'បញ្ចុះតម្លៃ',
          items: 'Items',
          customer: 'អតិថិជន',
          paymentmethod: 'វិធីសាស្រ្តបង់ប្រាក់',
          remark: 'ចំណាំ',
          paidamount: 'ចំនួនប្រាក់ដែលបានបង់',
          payback: 'ប្រាក់បង់ត្រលប់',
          neededamount: 'ចំនួនប្រាក់ដែលត្រូវបង់',
          more: 'បន្ថែមទៀត',
          click: 'ចុច',
          qrpay: 'ដើម្បីបទូទាត់ប្រាក់តាម KHQR',
          cart: 'រទេះ',
          cash:'សាច់ប្រាក់'
        },
        placeholders: {
          customer: 'សូមជ្រើសរើសអតិថិជន',
          paymentmethod: 'សូមជ្រើសរើសវិធីសាស្ត្រ ការទូទាត់',
          remark: 'បញ្ចូល ចំណាំ'
        },
        table: {
          clear: 'សម្អាត',
          emty: 'ទទេ',
          totalamoun: 'ប្រាក់សរុប',
          qty: 'ចំនួន',
          total: 'សរុប',
          price: 'តម្លៃ',
          discount: 'បញ្ចុះតម្លៃ',
          items: 'Items',
          customer: 'អតិថិជន',
          paymentmethod: 'វិធីសាស្រ្តបង់ប្រាក់',
          remark: 'ចំណាំ',
          paidamount: 'ចំនួនប្រាក់ដែលបានបង់',
          payback: 'ប្រាក់បង់ត្រលប់',
          neededamount: 'ចំនួនប្រាក់ដែលត្រូវបង់',
          more: 'បន្ថែមទៀត',
          click: 'ចុច',
          qrpay: 'ដើម្បីបទូទាត់ប្រាក់តាម KHQR',
          cart: 'រទេះ',
          cash: 'សាច់ប្រាក់'
        }
      },
      //bilitems
      billItem: {
        title: 'Bill Items',
        labels: {
          sugarlevel: 'ជាតិស្ករ',
        },
        table: {
          sugarlevel: 'ជាតិស្ករ',
        },
      },
      //productitem
      productItem: {
        title: 'Product Item',
        labels: {
          onecup: '១​ កែវ',
          choosesugar: 'ជ្រើសរើសកម្រិត ជាតិស្ករ',
          choseone: 'ជ្រើសរើស ១',
          sugar0: 'ជាតិស្ករ ០%',
          sugar10: 'ជាតិស្ករ ១០%',
          sugar25: 'ជាតិស្ករ ២៥%',
          sugar50: 'ជាតិស្ករ ៥០%',
          sugar75: 'ជាតិស្ករ ៧៥%',
          sugar100: 'ជាតិស្ករ ១០០%',
          addtocart: 'បញ្ចូលទៅកន្ត្រក',
          price: 'តម្លៃ',
          needed: 'ត្រូវការ',
          free: 'ឥតគិតថ្លៃ'
        },
        table: {
          onecup: '១​ កែវ',
          choosesugar: 'ជ្រើសរើសកម្រិត ជាតិស្ករ',
          choseone: 'ជ្រើសរើស ១',
          sugar0: 'ជាតិស្ករ ០%',
          sugar10: 'ជាតិស្ករ ១០%',
          sugar25: 'ជាតិស្ករ ២៥%',
          sugar50: 'ជាតិស្ករ ៥០%',
          sugar75: 'ជាតិស្ករ ៧៥%',
          sugar100: 'ជាតិស្ករ ១០០%',
          addtocart: 'បញ្ចូលទៅកន្ត្រក',
          price: 'តម្លៃ',
          needed: 'ត្រូវការ',
          free: 'ឥតគិតថ្លៃ'
        }
      },
      //invoices
      invoice:{
        title: 'Invoice',
        labels: {
          paymentsuccess: 'Payment successful',
          qrexpire: 'QR expired',
          expirein: 'Expires in',
        },
        table:{
        }
      },
      //dashboard
      dashboard:{
        title: 'Dashboard',
        labels: {
          categories: 'ប្រភេទ',
          customers: 'អតិថិជន',
          orders: 'ការបញ្ជាទិញ', 
          products: 'ទំនិញ',
          revenues: 'ប្រាក់ចំណូលសរុប', 
          orverviews: 'ទិដ្ឋភាពទូទៅ',
        },
        table:{
          categories: 'ប្រភេទ',
          customers: 'អតិថិជន',
          orders: 'ការបញ្ជាទិញ',
          products: 'ទំនិញ',
          revenues: 'ប្រាក់ចំណូលសរុប',
          orverviews: 'ទិដ្ឋភាពទូទៅ',
        }
      },
      //recentorders
      recentorders:{
        title: 'Recent Orders',
        labels: {
          recentorders: 'ការបញ្ជារទំនិញថ្មីៗ',
          orderno: 'លេខបញ្ជារទិញ',
          total: 'សរុប',
          paidamount: 'ចំនួនប្រាក់ដែលបានបង់',
          paymentmethod: 'វិធីសាស្រ្តការទូទាត់',
          cashier: 'អ្នកលក់',
          datetime: 'កាលបរិច្ឆេទ',
        },
        table:{
          recentorders: 'ការបញ្ជារទំនិញថ្មីៗ',
          orderno: 'លេខបញ្ជារទិញ',
          total: 'សរុប',
          paidamount: 'ចំនួនប្រាក់ដែលបានបង់',
          paymentmethod: 'វិធីសាស្រ្តការទូទាត់',
          cashier: 'អ្នកលក់',
          datetime: 'កាលបរិច្ឆេទ',
        }
      },
      //salereport
      //reports
      report: {
        title: 'របាយការណ៍',
        labels: {
          fromdate: 'ពីកាលបរិច្ឆេទ',
          todate: 'ដល់កាលបរិច្ឆេទ',
          filter: 'តម្រង',
          orderno: 'លេខបញ្ជាទិញ',
          orderdate: 'កាលបរិច្ឆេទបញ្ជាទិញ',
          customer: 'អតិថិជន',
          cashier: 'បេឡាករ',
          productname: 'ឈ្មោះផលិតផល',
          qty: 'ចំនួន',
          price: 'តម្លៃ',
          discount: 'បញ្ចុះតម្លៃ',
          brand: 'ម៉ាក',
          total: 'សរុប',
          salereport: 'របាយការណ៍លក់',
          loadingchart: 'កំពុងផ្ទុកតារាង...',
          year: 'ឆ្នាំ',
          month: 'ខែ',
          jan: 'មករា',
          feb: 'កុម្ភៈ',
          mar: 'មីនា',
          apr: 'មេសា',
          may: 'ឧសភា',
          jun: 'មិថុនា',
          jul: 'កក្កដា',
          aug: 'សីហា',
          sep: 'កញ្ញា',
          oct: 'តុលា',
          nov: 'វិច្ឆិកា',
          dec: 'ធ្នូ',
          lastmonth: 'ខែមុន',
          lastweek: 'សប្តាហ៍មុន',
          thismonth: 'ខែនេះ',
          thisweek: 'សប្តាហ៍នេះ',
          thisyear: 'ឆ្នាំនេះ',
          today: 'ថ្ងៃនេះ',
          salethismonth: 'ការលក់ខែនេះ',
          orderthismonth: 'ការបញ្ជាទិញខែនេះ',
          bong: 'បុង',
          analysispermoth: 'វិភាគតាមខែ',
          nodata: 'មិនមានទិន្នន័យទេ',
          nodatatoshow: 'មិនមានទិន្នន័យលក់ដើម្បីបង្ហាញតារាងទេ'
        },
        table: {
          fromdate: 'ពីកាលបរិច្ឆេទ',
          todate: 'ដល់កាលបរិច្ឆេទ',
          filter: 'តម្រង',
          orderno: 'លេខបញ្ជាទិញ',
          orderdate: 'កាលបរិច្ឆេទបញ្ជាទិញ',
          customer: 'អតិថិជន',
          cashier: 'បេឡាករ',
          productname: 'ឈ្មោះផលិតផល',
          qty: 'ចំនួន',
          price: 'តម្លៃ',
          discount: 'បញ្ចុះតម្លៃ',
          brand: 'ម៉ាក',
          total: 'សរុប',
          salereport: 'របាយការណ៍លក់',
          loadingchart: 'កំពុងផ្ទុកតារាង...',
          year: 'ឆ្នាំ',
          month: 'ខែ',
          jan: 'មករា',
          feb: 'កុម្ភៈ',
          mar: 'មីនា',
          apr: 'មេសា',
          may: 'ឧសភា',
          jun: 'មិថុនា',
          jul: 'កក្កដា',
          aug: 'សីហា',
          sep: 'កញ្ញា',
          oct: 'តុលា',
          nov: 'វិច្ឆិកា',
          dec: 'ធ្នូ',
          lastmonth: 'ខែមុន',
          lastweek: 'សប្តាហ៍មុន',
          thismonth: 'ខែនេះ',
          thisweek: 'សប្តាហ៍នេះ',
          thisyear: 'ឆ្នាំនេះ',
          today: 'ថ្ងៃនេះ',
          salethismonth: 'ការលក់ខែនេះ',
          orderthismonth: 'ការបញ្ជាទិញខែនេះ',
          bong: 'បុង',
          analysispermoth: 'វិភាគតាមខែ',
          nodata: 'មិនមានទិន្នន័យទេ',
          nodatatoshow: 'មិនមានទិន្នន័យលក់ដើម្បីបង្ហាញតារាងទេ'
        }
      },

    }
  },
  ch:{
    translation: {
      common: {
        language: '语言',
        english: '英文',
        chinese: '中文',
        khmer: '柬文',
        logout: '登出',
        no_data: '没有数据',
        all: '全部',
        yes: '是',
        no: '否',
        close: '关闭',
        cancel: '取消',
        save: '保存',
        update: '更新',
        view: '查看',
        new: '新增',
        search: '搜索',
        status: '状态',
        active: '启用',
        inactive: '停用',
        image: '图片',
        action: '操作',
        number: '编号',
        price: '价格',
        discount: '折扣',
        description: '描述',
        brand: '品牌',
        category: '类别',
        product_name: '产品名称',
        profile: '个人资料',
        currency: '货币',
        setting: '设置',
        hotdrink: '热饮',
        print: '打印',
        filter: '筛选'
      },
      app: {
        title: '管理销售点系统',
        brand: 'V-Friend 咖啡'
      },
      menu: {
        dashboard: '仪表盘',
        pos: '销售点',
        product: '产品',
        category: '类别',
        customer: '客户',
        order: '订单',
        supplier: '供应商',
        expense: '支出',
        stock: '库存',
        stock_coffee: '咖啡库存',
        report: '报告',
        getsalereport: '销售报告',
        sale_summary: '销售汇总',
        users_group: '普通用户',
        user: '用户',
        role: '角色',
        setting: '设置',
        currency: '货币'
      },
      login: {
        title: '登录',
        titles: 'LOGIN',
        username: '用户名',
        password: '密码',
        remember: '记住我',
        submit: '登录',
        success: '登录成功！',
        failed: '登录失败，请重试。',
        error: '连接服务器出错。请检查您的网络连接...!'
      },
      validation: {
        username_required: '请输入您的邮箱！',
        password_required: '请输入您的密码！',
        product_name_required: '请输入产品名称！',
        brand_required: '请选择品牌！',
        category_required: '请选择类别！',
        status_required: '请选择状态！',
        customer_name_required: '请输入客户姓名！',
        phone_required: '请输入电话号码！',
        email_required: '请输入邮箱！',
        email_invalid: '请输入有效的邮箱地址！'
      },
      //products
      product: {
        total_count: '产品总数 {{count}}',
        labels: {
          name: '产品名称',
          brand: '品牌',
          discount: '折扣',
          category: '类别',
          price: '价格',
          status: '状态',
          description: '描述',
          image: '图片'
        },
        placeholders: {
          name: '输入产品名称',
          brand: '选择品牌',
          discount: '折扣',
          category: '选择类别',
          price: '价格',
          status: '选择状态',
          description: '描述'
        },
        table: {
          no: '编号',
          name: '产品名称',
          description: '描述',
          category: '类别',
          brand: '品牌',
          price: '价格',
          discount: '折扣',
          status: '状态',
          image: '图片',
          action: '操作'
        },
        confirm: {
          delete_title: '删除 {{name}}',
          delete_content: '确定要删除 {{name}} 吗？'
        }
      },

      //订单
      order: {
        title: '订单表',
        labels: {
          order_no: '订单编号',
          order_date: '订单日期',
          customer: '客户',
          total_amount: '总金额',
          paid_amount: '已付金额',
          pay_back: '找零',
          status: '状态',
          payment_method: '付款方式',
          remark: '备注',
          cashier: '收银员',
          created_at: '创建时间',
          updated_at: '更新时间',
          action: '操作',
          detail: '详情',
          payment_status: '付款状态',
          product: '产品',
          p_category_name: '类别名称',
          p_image: '图片',
          sugar_level: '糖度',
          qty: '数量',
          price: '价格',
          discount: '折扣',
          total: '总计',
          filter: '筛选',
          orders: '订单',
          total_orders: '总订单数',
          bong: '小票号'
        },
        placeholders: {
          order_date: '选择订单日期',
          customer: '选择客户',
          total_amount: '总金额',
          paid_amount: '已付金额',
          pay_back: '找零',
          status: '选择状态'
        },
        table: {
          no: '编号',
          order_no: '订单编号',
          order_date: '订单日期',
          customer: '客户',
          total_amount: '总金额',
          paid_amount: '已付金额',
          pay_back: '找零',
          status: '状态',
          action: '操作',
          created_at: '创建时间',
          updated_at: '更新时间',
          detail: '详情',
          payment_status: '付款状态',
          payment_method: '付款方式',
          remark: '备注',
          cashier: '收银员',
          product: '产品',
          p_category_name: '类别名称',
          p_image: '图片',
          sugar_level: '糖度',
          qty: '数量',
          price: '价格',
          discount: '折扣',
          total: '总计',
          filter: '筛选',
          orders: '订单',
          total_orders: '总订单数',
          bong: '小票号'
        },
        modal: {
          new: '创建订单',
          view: '查看订单'
        },
        confirm: {
          delete_title: '删除订单 #{{id}}',
          delete_content: '确定要删除订单 #{{id}} 吗？'
        }
      },

      //categories
      category: {
        title: '类别表',
        labels: {
          name: '类别名称',
          description: '描述',
          status: '状态'
        },
        placeholders: {
          name: '输入类别名称',
          description: '描述'
        },
        table: {
          no: '编号',
          name: '名称',
          description: '描述',
          status: '状态',
          action: '操作'
        },
        confirm: {
          delete_title: '删除 {{name}}',
          delete_content: '确定要删除 {{name}} 吗？'
        }
      },
      //exchange
      exchange: {
        title: '汇率兑换表',
        labels: {
          ex: '兑换',
          amount: '金额',
          exchange_rate: '汇率',
          usd: '美元 (USD)',
          khr: '瑞尔 (KHR)',
          clear: '清除',
        },
        placeholders: {
          amount: '输入金额',
          exchange_rate: '输入汇率',
          usd: '输入美元金额',
          khr: '输入瑞尔金额',
        },
        table: {
          ex: '兑换',
          amount: '金额',
          exchange_rate: '汇率',
          usd: '美元 (USD)',
          khr: '瑞尔 (KHR)',
          clear: '清除',
        },
      },

      //customers
      customer: {
        title: '客户表',
        labels: {
          name: '客户名称',
          phone: '电话',
          email: '电子邮箱',
          address: '地址',
          description: '描述',
          status: '状态',
        },
        placeholders: {
          name: '输入客户名称',
          phone: '输入电话号码',
          email: '输入电子邮箱',
          address: '输入地址',
          description: '描述',
          status: '选择状态',
        },
        table: {
          no: '编号',
          name: '名称',
          phone: '电话',
          email: '联系方式',
          address: '地址',
          description: '描述',
          status: '状态',
          action: '操作',
        },
        modal: {
          new: '创建客户',
          view: '查看',
        },
        confirm: {
          delete_title: '删除 {{name}}',
          delete_content: '确定要删除 {{name}} 吗？',
        },
      },

      //supllier
      supplier: {
        title: '供应商表',
        labels: {
          name: '供应商名称',
          phone: '电话',
          email: '电子邮箱',
          supplier_address: '地址',
          description: '描述',
          status: '状态',
          action: '操作',
          created_at: '创建时间',
          updated_at: '更新时间',
        },
        placeholders: {
          name: '输入供应商名称',
          phone: '输入电话号码',
          email: '输入电子邮箱',
          supplier_address: '输入地址',
          description: '描述',
          status: '选择状态',
        },
        table: {
          no: '编号',
          name: '名称',
          phone: '电话',
          email: '联系方式',
          supplier_address: '地址',
          description: '描述',
          status: '状态',
          action: '操作',
        },
        modal: {
          new: '创建供应商',
          view: '查看',
        },
        confirm: {
          delete_title: '删除 {{name}}',
          delete_content: '确定要删除 {{name}} 吗？',
        },
      },

      //expenses
      expense: {
        title: '支出表',
        labels: {
          name: '支出名称',
          expensetype: '支出类型',
          amount: '金额',
          vendorpayee: '供应商/收款方',
          paymentmethod: '付款方式',
          expense_date: '支出日期',
          description: '描述',
          status: '状态',
          action: '操作',
          created_at: '创建时间',
          created_by: '创建人',
          updated_at: '更新时间',
          lastmonth: '上个月',
          thismonth: '本月',
          thisyear: '今年',
          totalexpense: '总支出',
        },
        placeholders: {
          name: '输入支出名称',
          amount: '输入金额',
          vendorpayee: '选择供应商/收款方',
          paymentmethod: '选择付款方式',
          expense_date: '选择支出日期',
          description: '描述',
          status: '选择状态',
        },
        table: {
          no: '编号',
          name: '名称',
          expensetype: '支出类型',
          amount: '金额',
          vendorpayee: '供应商/收款方',
          paymentmethod: '付款方式',
          expense_date: '支出日期',
          description: '描述',
          status: '状态',
          action: '操作',
          created_at: '创建时间',
          created_by: '创建人',
          updated_at: '更新时间',
          lastmonth: '上个月',
          thismonth: '本月',
          thisyear: '今年',
          totalexpense: '总支出',
        },
        modal: {
          new: '创建支出',
          view: '查看',
        },
        confirm: {
          delete_title: '删除 {{name}}',
          delete_content: '确定要删除 {{name}} 吗？',
        },
      },

      //stocks
      stock: {
        title: '库存表',
        labels: {
          name: '产品名称',
          producttype: '产品类型',
          supplier: '供应商',
          qtyinstock: '库存数量',
          newqty: '新增数量',
          expenseKg: '每公斤成本',
          total_expense: '总支出',
          description: '描述',
          note: '备注',
          stocktype: '库存类型',
          coffee: '咖啡',
          others: '其他',
          otherstock: '其他库存',
          stockcoffee: '咖啡库存',
          totalexpense: '总支出',
          product: '产品',
          category: '类别',
          quantity: '数量',
          status: '状态',
          action: '操作',
          created_at: '创建时间',
          updated_at: '更新时间',
          brand: '品牌',
        },
        placeholders: {
          product: '选择产品',
          supplier: '选择供应商',
          stocktype: '选择库存类型',
          category: '选择类别',
          quantity: '输入数量',
          status: '选择状态',
          description: '描述',
          note: '备注',
          brand: '选择品牌',
        },
        table: {
          no: '编号',
          name: '产品名称',
          producttype: '产品类型',
          stocktype: '库存类型',
          supplier: '供应商',
          qtyinstock: '库存数量',
          newqty: '新增数量',
          expenseKg: '每公斤成本',
          total_expense: '总支出',
          description: '描述',
          note: '备注',
          coffee: '咖啡',
          totalexpense: '总支出',
          others: '其他',
          otherstock: '其他库存',
          stockcoffee: '咖啡库存',
          product: '产品',
          category: '类别',
          quantity: '数量',
          status: '状态',
          action: '操作',
          brand: '品牌',
        },
        modal: {
          new: '创建库存',
          view: '查看',
        },
        confirm: {
          delete_title: '删除 {{name}} 的库存',
          delete_content: '确定要删除 {{name}} 的库存吗？',
        },
      },

      //users
      user: {
        title: '用户表',
        labels: {
          name: '姓名',
          username: '用户名',
          role: '角色',
          status: '状态',
          password: '密码',
          confirm_password: '确认密码',
          create_by: '创建人',
        },
        placeholders: {
          name: '输入姓名',
          username: '输入用户名',
          email: '输入邮箱',
          role: '选择角色',
          status: '选择状态',
          password: '输入密码',
          confirm_password: '确认密码',
          create_by: '创建人',
        },
        table: {
          no: '编号',
          name: '姓名',
          username: '用户名',
          email: '邮箱',
          role: '角色',
          status: '状态',
          action: '操作',
          create_by: '创建人',
        },
        modal: {
          new: '创建用户',
          view: '查看',
        },
        confirm: {
          delete_title: '删除 {{name}}',
          delete_content: '确定要删除 {{name}} 吗？',
          confirm_delete_content: '确定要删除 {{name}} 吗？',
          delete_success: '成功删除用户 {{name}}！',
          delete_failed: '删除用户 {{name}} 失败！',
        },
      },

      //roles
      role: {
        title: '角色表',
        labels: {
          name: '角色名称',
          description: '描述',
          status: '状态',
          permission: '权限',
          all: '全部',
        },
        placeholders: {
          name: '输入角色名称',
          description: '描述',
          status: '选择状态',
        },
        table: {
          no: '编号',
          name: '名称',
          permission: '权限',
          description: '描述',
          all: '全部',
          status: '状态',
          action: '操作',
        },
        confirm: {
          delete_title: '删除 {{name}}',
          delete_content: '确定要删除 {{name}} 吗？',
        },
      },

      //POS 
      pos: {
        title: '收银系统',
        labels: {
          paymentsuccess: '支付成功',
          qrexpire: '二维码已过期',
          expirein: '将在...后过期',
          makeassprint: '标记为已付款并打印',
          categorie: '类别',
          notfound: '未找到产品',
          second: '秒',
        },
        table: {
          paymentsuccess: '支付成功',
          qrexpire: '二维码已过期',
          expirein: '将在...后过期',
          makeassprint: '标记为已付款并打印',
          categorie: '类别',
          notfound: '未找到产品',
          second: '秒',
        },
      },
      //cart
      cart: {
        title: '购物车',
        labels: {
          clear: '清空',
          emty: '空的',
          totalamoun: '总金额',
          qty: '数量',
          total: '总计',
          price: '价格',
          discount: '折扣',
          items: '项目',
          customer: '客户',
          paymentmethod: '付款方式',
          remark: '备注',
          paidamount: '已付金额',
          payback: '找零',
          neededamount: '应付金额',
          more: '更多',
          click: '点击',
          qrpay: 'KHQR 二维码支付',
          cart: '购物车',
          cash: '现金'
        },
        placeholders: {
          customer: '请选择客户',
          paymentmethod: '请选择付款方式'
        },
        table: {
          clear: '清空',
          emty: '空的',
          totalamoun: '总金额',
          qty: '数量',
          total: '总计',
          price: '价格',
          discount: '折扣',
          items: '项目',
          customer: '客户',
          paymentmethod: '付款方式',
          remark: '备注',
          paidamount: '已付金额',
          payback: '找零',
          neededamount: '应付金额',
          more: '更多',
          click: '点击',
          qrpay: 'KHQR 二维码支付',
          cart: '购物车',
          cash: '现金'
        }
      },
      //billItems
      billItem: {
        title: '账单项目',
        labels: {
          sugarlevel: '糖度',
        },
        table: {
          sugarlevel: '糖度',
        },
      },
      //productItem
      productItem: {
        title: '产品项目',
        labels: {
          onecup: '1 杯',
          choosesugar: '选择糖度',
          choseone: '选择 1',
          sugar0: '糖 0%',
          sugar10: '糖 10%',
          sugar25: '糖 25%',
          sugar50: '糖 50%',
          sugar75: '糖 75%',
          sugar100: '糖 100%',
          addtocart: '加入购物车',
          price: '价格',
          needed: '需要',
          free: '免费'
        },
        table: {
          onecup: '1 杯',
          choosesugar: '选择糖度',
          choseone: '选择 1',
          sugar0: '糖 0%',
          sugar10: '糖 10%',
          sugar25: '糖 25%',
          sugar50: '糖 50%',
          sugar75: '糖 75%',
          sugar100: '糖 100%',
          addtocart: '加入购物车',
          price: '价格',
          needed: '需要',
          free: '免费'
        }
      },
      //invoices
      invoice: {
        title: '发票',
        labels: {
          paymentsuccess: '支付成功',
          qrexpire: '二维码已过期',
          expirein: '将在...后过期',
        },
        table: {}
      },
      //dashboard
      dashboard: {
        title: '仪表板',
        labels: {
          categories: '类别',
          customers: '客户',
          orders: '订单',
          products: '产品',
          revenues: '总收入',
          orverviews: '概览',
        },
        table: {
          categories: '类别',
          customers: '客户',
          orders: '订单',
          products: '产品',
          revenues: '总收入',
          orverviews: '概览',
        }
      },
      //recentorders
      recentorders: {
        title: '最近订单',
        labels: {
          recentorders: '最近订单',
          orderno: '订单编号',
          total: '总计',
          paidamount: '已付金额',
          paymentmethod: '付款方式',
          cashier: '收银员',
          datetime: '日期时间',
        },
        table: {
          recentorders: '最近订单',
          orderno: '订单编号',
          total: '总计',
          paidamount: '已付金额',
          paymentmethod: '付款方式',
          cashier: '收银员',
          datetime: '日期时间',
        }
      },
      //reports
      //reports
      report: {
        title: '报告',
        labels: {
          fromdate: '起始日期',
          todate: '结束日期',
          filter: '筛选',
          orderno: '订单号',
          orderdate: '订单日期',
          customer: '客户',
          cashier: '收银员',
          productname: '产品名称',
          qty: '数量',
          price: '价格',
          discount: '折扣',
          brand: '品牌',
          total: '总计',
          salereport: '销售报告',
          loadingchart: '加载图表中...',
          year: '年份',
          month: '月份',
          jan: '一月',
          feb: '二月',
          mar: '三月',
          apr: '四月',
          may: '五月',
          jun: '六月',
          jul: '七月',
          aug: '八月',
          sep: '九月',
          oct: '十月',
          nov: '十一月',
          dec: '十二月',
          lastmonth: '上个月',
          lastweek: '上周',
          thismonth: '本月',
          thisweek: '本周',
          thisyear: '今年',
          today: '今天',
          salethismonth: '本月销售额',
          orderthismonth: '本月订单数',
          bong: '老板',
          analysispermoth: '每月分析',
          nodata: '暂无数据',
          nodatatoshow: '没有销售数据可用于显示图表'
        },
        table: {
          fromdate: '起始日期',
          todate: '结束日期',
          filter: '筛选',
          orderno: '订单号',
          orderdate: '订单日期',
          customer: '客户',
          cashier: '收银员',
          productname: '产品名称',
          qty: '数量',
          price: '价格',
          discount: '折扣',
          brand: '品牌',
          total: '总计',
          salereport: '销售报告',
          loadingchart: '加载图表中...',
          year: '年份',
          month: '月份',
          jan: '一月',
          feb: '二月',
          mar: '三月',
          apr: '四月',
          may: '五月',
          jun: '六月',
          jul: '七月',
          aug: '八月',
          sep: '九月',
          oct: '十月',
          nov: '十一月',
          dec: '十二月',
          lastmonth: '上个月',
          lastweek: '上周',
          thismonth: '本月',
          thisweek: '本周',
          thisyear: '今年',
          today: '今天',
          salethismonth: '本月销售额',
          orderthismonth: '本月订单数',
          bong: '老板',
          analysispermoth: '每月分析',
          nodata: '暂无数据',
          nodatatoshow: '没有销售数据可用于显示图表'
        }
      },
      //
    }
  },
};
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debugger:true,
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['localStorage']
      }
    });

export default i18n;
