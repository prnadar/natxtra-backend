const Adminauth = require("../../models/Adminauth");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Leads = require("../../models/Leads");
const PurchaseInvoice = require("../../models/PurchaseInvoice");
const SalesInvoice = require("../../models/SalesInvoice");
const EstimationInvoice = require("../../models/EstimationInvoice");

class AccountController {
  static dashboard = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      return res.render("admin/accounts-dash-new", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "accounts", // Added pageId parameter
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static getUserAddress = async (req, res) => {
    try {
      const { name } = req.query;

      const lead = await Leads.findOne({ contact_person: name }).lean();

      if (!lead) {
        return res.json({ success: false });
      }

      return res.json({
        success: true,
        data: {
          address: lead.address || "",
          city: lead.city || "",
          state: lead.state || "",
          pincode: lead.pincode || "",
          gst_num: lead.gst_num || "",
        },
      });
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  };

  static purchaseInvoice = async (req, res) => {
    try {
      const purchaseInvoices = await PurchaseInvoice.find()
        .populate("user_id product_id")
        .lean();

      return res.render("admin/accounts-purchase-invoice", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "accounts", // Added pageId parameter
        purchaseInvoices,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static createPurchaseInvoice = async (req, res) => {
    try {
      const users = await User.find();
      const products = await Product.find();

      const leads = await Leads.find({}, { contact_person: 1 }).lean();

      // Filter out empty or null contact persons
      const contactPersons = leads
        .map((lead) => lead.contact_person)
        .filter((name) => name && name.trim() !== "");

      // 🟩 Auto-generate invoice number logic
      const lastInvoice = await PurchaseInvoice.findOne()
        .sort({ createdAt: -1 }) // latest one
        .lean();

      let nextNumber = 1;
      if (lastInvoice?.invoice_number) {
        const match = lastInvoice.invoice_number.match(/INV-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const invoiceNumber = `INV-${nextNumber.toString().padStart(3, "0")}`;

      return res.render("admin/create-purchase-invoice", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "accounts", // Added pageId parameter
        users,
        contactPersons,
        products,
        invoiceNumber,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static create_purchaseInvoice = async (req, res) => {
    try {
      const insertRecord = PurchaseInvoice({
        customer_name: req.body.customer_name,
        user_id: req.body.user_id,
        billing_address: {
          address: req.body.billing_address.address,
          city: req.body.billing_address.city,
          state: req.body.billing_address.state,
          pincode: req.body.billing_address.pincode,
        },
        shipping_address: {
          address: req.body.shipping_address.address,
          city: req.body.shipping_address.city,
          state: req.body.shipping_address.state,
          pincode: req.body.shipping_address.pincode,
        },
        invoice_number: req.body.invoice_number,
        gst_number: req.body.gst_number,
        invoice_date: new Date(req.body.invoice_date),
        due_date: new Date(req.body.due_date),
        payment_mode: req.body.payment_mode,
        payment_status: req.body.payment_status,
        product_id: req.body.product_id,
        quantity: parseInt(req.body.quantity, 10),
        rate: parseFloat(req.body.rate),
        hsn_code: req.body.hsn_code,
        sgst: parseFloat(req.body.sgst || 0),
        cgst: parseFloat(req.body.cgst || 0),
        igst: parseFloat(req.body.igst || 0),
        total: parseFloat(req.body.total),
        subtotal: parseFloat(req.body.subtotal),
        discount: parseFloat(req.body.discount || 0),
        discount_type: req.body.discount_type,
        total: req.body.total,
      });
      await insertRecord.save();
      return res.send({
        status: 200,
        message: "Purchase Invoice created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static salesInvoice = async (req, res) => {
    try {
      const salesInvoices = await SalesInvoice.find()
        .populate("user_id product_id")
        .lean();

      return res.render("admin/accounts-sales-invoice", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "accounts", // Added pageId parameter
        salesInvoices,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static createSalesInvoice = async (req, res) => {
    try {
      const users = await User.find();
      const products = await Product.find();
      const leads = await Leads.find({}, { contact_person: 1 }).lean();

      // Filter out empty or null contact persons
      const contactPersons = leads
        .map((lead) => lead.contact_person)
        .filter((name) => name && name.trim() !== "");

      // 🟩 Auto-generate invoice number logic
      const lastInvoice = await SalesInvoice.findOne()
        .sort({ createdAt: -1 }) // latest one
        .lean();

      let nextNumber = 1;
      if (lastInvoice?.invoice_number) {
        const match = lastInvoice.invoice_number.match(/INV-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const invoiceNumber = `INV-${nextNumber.toString().padStart(3, "0")}`;
      return res.render("admin/create-sales-invoice", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "accounts", // Added pageId parameter
        users,
        contactPersons,
        products,
        invoiceNumber,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static create_salesInvoice = async (req, res) => {
    try {
      const insertRecord = SalesInvoice({
        customer_name: req.body.customer_name,
        user_id: req.body.user_id,
        billing_address: {
          address: req.body.billing_address.address,
          city: req.body.billing_address.city,
          state: req.body.billing_address.state,
          pincode: req.body.billing_address.pincode,
        },
        shipping_address: {
          address: req.body.shipping_address.address,
          city: req.body.shipping_address.city,
          state: req.body.shipping_address.state,
          pincode: req.body.shipping_address.pincode,
        },
        invoice_number: req.body.invoice_number,
        gst_number: req.body.gst_number,
        invoice_date: new Date(req.body.invoice_date),
        due_date: new Date(req.body.due_date),
        payment_mode: req.body.payment_mode,
        payment_status: req.body.payment_status,
        product_id: req.body.product_id,
        quantity: parseInt(req.body.quantity, 10),
        rate: parseFloat(req.body.rate),
        hsn_code: req.body.hsn_code,
        sgst: parseFloat(req.body.sgst || 0),
        cgst: parseFloat(req.body.cgst || 0),
        igst: parseFloat(req.body.igst || 0),
        total: parseFloat(req.body.total),
        subtotal: parseFloat(req.body.subtotal),
        discount: parseFloat(req.body.discount || 0),
        discount_type: req.body.discount_type,
        total: req.body.total,
      });
      await insertRecord.save();
      return res.send({
        status: 200,
        message: "Sales Invoice created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static estimationInvoice = async (req, res) => {
    try {
      const estimationInvoices = await EstimationInvoice.find()
        .populate("user_id product_id")
        .lean();
      return res.render("admin/accounts-estimation-invoice", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "accounts", // Added pageId parameter
        estimationInvoices,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static createEstimationInvoice = async (req, res) => {
    try {
      const users = await User.find();
      const products = await Product.find();
      const leads = await Leads.find({}, { contact_person: 1 }).lean();

      // Filter out empty or null contact persons
      const contactPersons = leads
        .map((lead) => lead.contact_person)
        .filter((name) => name && name.trim() !== "");

      // 🟩 Auto-generate invoice number logic
      const lastInvoice = await EstimationInvoice.findOne()
        .sort({ createdAt: -1 }) // latest one
        .lean();

      let nextNumber = 1;
      if (lastInvoice?.invoice_number) {
        const match = lastInvoice.invoice_number.match(/INV-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const invoiceNumber = `INV-${nextNumber.toString().padStart(3, "0")}`;
      return res.render("admin/create-estimation-invoice", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "accounts", // Added pageId parameter
        users,
        contactPersons,
        products,
        invoiceNumber,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static create_estimationInvoice = async (req, res) => {
    try {
      const insertRecord = EstimationInvoice({
        customer_name: req.body.customer_name,
        user_id: req.body.user_id,
        billing_address: {
          address: req.body.billing_address.address,
          city: req.body.billing_address.city,
          state: req.body.billing_address.state,
          pincode: req.body.billing_address.pincode,
        },
        shipping_address: {
          address: req.body.shipping_address.address,
          city: req.body.shipping_address.city,
          state: req.body.shipping_address.state,
          pincode: req.body.shipping_address.pincode,
        },
        invoice_number: req.body.invoice_number,
        gst_number: req.body.gst_number,
        invoice_date: new Date(req.body.invoice_date),
        due_date: new Date(req.body.due_date),
        payment_mode: req.body.payment_mode,
        payment_status: req.body.payment_status,
        product_id: req.body.product_id,
        quantity: parseInt(req.body.quantity, 10),
        rate: parseFloat(req.body.rate),
        hsn_code: req.body.hsn_code,
        sgst: parseFloat(req.body.sgst || 0),
        cgst: parseFloat(req.body.cgst || 0),
        igst: parseFloat(req.body.igst || 0),
        total: parseFloat(req.body.total),
        subtotal: parseFloat(req.body.subtotal),
        discount: parseFloat(req.body.discount || 0),
        discount_type: req.body.discount_type,
        total: req.body.total,
      });
      await insertRecord.save();
      return res.send({
        status: 200,
        message: "Estimation Invoice created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };
}

module.exports = AccountController;
