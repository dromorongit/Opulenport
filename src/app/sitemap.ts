import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import Product from "@/models/Product";
import Service from "@/models/Service";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes = [
    "/",
    "/about",
    "/products",
    "/services",
    "/faq",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    const publishedPosts = await BlogPost.find({ published: true })
      .select("slug updatedAt")
      .lean();

    const blogRoutes = publishedPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? new Date(),
    }));

    const products = await Product.find({})
      .select("slug category updatedAt")
      .lean();

    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.category}/${product.slug}`,
      lastModified: product.updatedAt ?? new Date(),
    }));

    const services = await Service.find({}).lean();

    const serviceRoutes = services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: (service as any).updatedAt ?? new Date(),
    }));

    dynamicRoutes = [...blogRoutes, ...productRoutes, ...serviceRoutes];
  } catch (error) {
    console.error("Sitemap generation failed to fetch dynamic routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}