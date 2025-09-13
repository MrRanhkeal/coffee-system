const { db, logErr, isArray, isEmpty } = require("../util/helper");
exports.getlist = async (req, res) => {
    try {
        const [category] = await db.query("select id as value, name as label,description from category");
        const [role] = await db.query("select id, name from roles");
        const [supplier] = await db.query("select id, name from supplier");
        //and more

        const brand = [
            { label: "មណ្ឌលគិរី​កាហ្វេ", value: "មណ្ឌលគិរី​កាហ្វេ", country: "kh" },
            { label: "Arabia Coffee", value: "Arabia Coffee", country: "vn" },
            { label: "Amazon Coffee", value: "Amazon Coffee", country: "th" },
            { label: "Bodia Tea", value: "Bodia Tea", country: "kh" },
            { label: "ChaTraMue Tea", value: "ChaTraMue Tea", country: "th" },
            { label: "Soda", value: "Soda", country: "kh" },
            { label: "Milk", value: "Milk", country: "kh" },
            { label: "Coconut", value: "Coconut", country: "kh" },
        ];
        const categories = [
            { label: "មណ្ឌលគិរី​កាហ្វេ", value: "មណ្ឌលគិរី​កាហ្វេ", country: "kh" },
            { label: "Arabia Coffee", value: "Arabia Coffee", country: "vn" },
            { label: "Amazon Coffee", value: "Amazon Coffee", country: "th" },
            { label: "Bodia Tea", value: "Bodia Tea", country: "kh" },
            { label: "ChaTraMue Tea", value: "ChaTraMue Tea", country: "th" },
            { label: "Soda", value: "Soda", country: "kh" },
            { label: "Milk", value: "Milk", country: "kh" },
            { label: "Coconut", value: "Coconut", country: "kh" },
            { label: "Test", value: "Test", country: "kh" },
        ];
        const name_product =[
            { label: "អាម៉ាហ្សូន", value: "អាម៉ាហ្សូន" },
            { label: "Mondolkiri", value: "Mondolkiri" },
            { label: "Vietnam", value: "Vietnam" },
        ];
        const brand_name = [
            { label: "khmer cup", value: "khmer cup" }, 
            { label: "vietnam cup", value: "vietnam cup" }, 
            { label: "orthers cup", value: "orthers cup" }, 


        ];
        //product_type
        const product_type = {
            Coffee: [
                { label: "Americano", value: "Americano" },
                { label: "Black Coffee", value: "Black Coffee" },
                { label: "Espresso", value: "Espresso" },
                { label: "ឡាតេ", value: "ឡាតេ" },
                { label: "Coffee Milk", value: "Coffee Milk" },
                { label: "Coffee Mocha", value: "Coffee Mocha" },
                { label: "Coffee Vanilla", value: "Coffee Vanilla" },
                { label: "Coffee Honey", value: "Coffee Honey" },
                { label: "Coffee Avocado", value: "Coffee Avocado" },
                { label: "Coffee Strawberry", value: "Coffee Strawberry" },
                { label: "Coffee Dream", value: "Coffee Dream" },
                { label: "Coffee with Cream", value: "Coffee with Cream" },
                { label: "Coffee Coconut", value: "Coffee Coconut" },
                { label: "Coffee Latte Matcha", value: "Coffee Latte Matcha" },
                { label: "Coffee Chocolate Coconut", value: "Coffee Chocolate Coconut" }
            ],
        };
        const product_name = [
            { label: "អាម៉ាហ្សូន", value: "អាម៉ាហ្សូន" },
            { label: "Mondolkiri", value: "Mondolkiri" },
            { label: "Vietnam", value: "Vietnam" },
        ];
        // const product_name = {

        //     Coffee: [
        //         { label: "អាម៉ាហ្សូន", value: "អាម៉ាហ្សូន" },
        //         { label: "Mondolkiri", value: "Mondolkiri" },
        //         { label: "Vietnam", value: "Vietnam" },
        //     ],
        //     Tea: [
        //         { label: "Laluna Green Tea Milk", value: "Laluna Green Tea Milk" },
        //         { label: "Thai Tea Milk", value: "Thai Tea Milk" },
        //         { label: "Milo Milk", value: "Milo Milk" },
        //         { label: "Ovaltine Milk", value: "Ovaltine Milk" },
        //         { label: "Taro Milk", value: "Taro Milk" },
        //         { label: "Chocolate Milk", value: "Chocolate Milk" },
        //         { label: "Oreo Milk", value: "Oreo Milk" },
        //         { label: "Strawberry Milk", value: "Strawberry Milk" },
        //         { label: "Blueberry Milk", value: "Blueberry Milk" },
        //         { label: "Soda Milk", value: "Soda Milk" },
        //         { label: "Passion Milk", value: "Passion Milk" },
        //         { label: "Ginger Milk", value: "Ginger Milk" },
        //         { label: "Matcha Latte", value: "Matcha Latte" }
        //     ],
        // };
        const cup_product = {
            Cup_product: [
                { label: "Amazon", value: "Amazon" },
                { label: "Mondolkiri", value: "Mondolkiri" },
                { label: "Vietnam", value: "Vietnam" },
            ],
        };
        const expense_type = [
            { label: "ប្រាក់ខែបុគ្គលិក", value: "ប្រាក់ខែបុគ្គលិក" },
            { label: "Product Origin", value: "Product Origin" },
            { label: "Machine Maintenance", value: "Machine Maintenance" },
            { label: "Power Consumption", value: "Power Consumption" },
            { label: "Other", value: "Other" },
        ];
        const vendor_payee = [
            { label: "ប្រាក់ខែបុគ្គលិក", value: "ប្រាក់ខែបុគ្គលិក" },
            { label: "Machine Maintenance Payroll", value: "Machine Maintenance Payroll" },
            { label: "EDC Payroll", value: "EDC Payroll" },
            { label: "Supplier Payroll", value: "Supplier Payroll" },
            { label: "Other", value: "Other" },
        ];
        const payment_method = [
            { label: "សាច់ប្រាក់", value: "សាច់ប្រាក់" },
            { label: "Credit Card", value: "Credit Card" },
            { label: "Debit Card", value: "Debit Card" },
        ];
        const supplier_address = [
            { label: "ភ្នំពេញ", value: "ភ្នំពេញ" },
            { label: "Sihanoukville", value: "Sihanoukville" },
            { label: "Vientiane", value: "Vientiane" },
            { label: "Thailand", value: "Thailand" },
        ];
        const [customer] = await db.query(
            "select id as value, concat(name) as label, name from customers"
        );
        res.json({
            category,
            role,
            supplier,
            brand,
            customer,
            expense_type,
            product_type,
            product_name,
            cup_product,
            categories,
            vendor_payee,
            payment_method,
            supplier_address,
            name_product,
            brand_name,
            message: "success"
        })
    }
    catch (error) {
        logErr("config.getlist", error, res);
    }
}; 