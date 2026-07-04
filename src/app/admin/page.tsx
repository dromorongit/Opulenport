import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import Inquiry from "@/models/Inquiry";
import VehicleRequest from "@/models/VehicleRequest";
import SupplierContactRequest from "@/models/SupplierContactRequest";
import ConsultationBooking from "@/models/ConsultationBooking";
import DepositPayment from "@/models/DepositPayment";
import Testimonial from "@/models/Testimonial";

async function getCounts() {
  await connectDB();
  const [
    products,
    services,
    blogPosts,
    publishedBlogPosts,
    draftBlogPosts,
    inquiries,
    inquiriesNew,
    inquiriesContacted,
    vehicleRequests,
    supplierContactRequests,
    bookings,
    bookingsPendingPayment,
    depositPayments,
    depositPaymentsPaid,
    testimonials,
    testimonialsPending,
  ] = await Promise.all([
    Product.countDocuments(),
    Service.countDocuments(),
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ published: true }),
    BlogPost.countDocuments({ published: false }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "new" }),
    Inquiry.countDocuments({ status: "contacted" }),
    VehicleRequest.countDocuments(),
    SupplierContactRequest.countDocuments(),
    ConsultationBooking.countDocuments(),
    ConsultationBooking.countDocuments({ paymentStatus: "pending" }),
    DepositPayment.countDocuments(),
    DepositPayment.countDocuments({ paymentStatus: "paid" }),
    Testimonial.countDocuments(),
    Testimonial.countDocuments({ approved: false }),
  ]);

  return {
    products,
    services,
    blogPosts,
    publishedBlogPosts,
    draftBlogPosts,
    inquiries,
    inquiriesNew,
    inquiriesContacted,
    vehicleRequests,
    supplierContactRequests,
    bookings,
    bookingsPendingPayment,
    depositPayments,
    depositPaymentsPaid,
    testimonials,
    testimonialsPending,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">Dashboard</h1>
        <p className="mt-1 text-sm text-cream/60">
          Overview of your OpulenPort inventory and customer activity.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-cream/80">Needs Attention</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {counts.inquiriesNew > 0 && (
            <StatCard
              title="New Inquiries"
              value={counts.inquiriesNew}
              highlight
            />
          )}
          {counts.bookingsPendingPayment > 0 && (
            <StatCard
              title="Pending Payments"
              value={counts.bookingsPendingPayment}
              highlight
            />
          )}
          {counts.testimonialsPending > 0 && (
            <StatCard
              title="Testimonials to Approve"
              value={counts.testimonialsPending}
              highlight
            />
          )}
          {counts.inquiriesContacted > 0 && (
            <StatCard
              title="Contacted Inquiries"
              value={counts.inquiriesContacted}
            />
          )}
          {counts.depositPaymentsPaid > 0 && (
            <StatCard
              title="Paid Deposits"
              value={counts.depositPaymentsPaid}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-cream/80">Content Management</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Products" value={counts.products} />
          <StatCard title="Services" value={counts.services} />
          <StatCard title="Blog Posts" value={counts.blogPosts} />
          <StatCard title="Published Posts" value={counts.publishedBlogPosts} />
          <StatCard title="Draft Posts" value={counts.draftBlogPosts} />
          <StatCard title="Testimonials" value={counts.testimonials} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-cream/80">Customer Activity</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Inquiries" value={counts.inquiries} />
          <StatCard title="Vehicle Requests" value={counts.vehicleRequests} />
          <StatCard title="Supplier Requests" value={counts.supplierContactRequests} />
          <StatCard title="Bookings" value={counts.bookings} />
          <StatCard title="Deposit Payments" value={counts.depositPayments} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-6 ${
        highlight
          ? "border-amber-500/40 bg-amber-500/10"
          : "border-gold/20 bg-navy-light"
      }`}
    >
      <p className={`text-sm font-medium ${highlight ? "text-amber-400" : "text-cream/60"}`}>
        {title}
      </p>
      <p className={`mt-2 text-3xl font-bold ${highlight ? "text-amber-300" : "text-gold"}`}>
        {value}
      </p>
    </div>
  );
}
