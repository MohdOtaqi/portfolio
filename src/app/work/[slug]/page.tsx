import { ProjectPage, projectMetadata, projectParams } from "@/components/project-page";

export const dynamicParams = false;
export const generateStaticParams = projectParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return projectMetadata("en", slug);
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectPage locale="en" slug={slug} />;
}
