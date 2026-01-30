import * as React from 'react';
import { useState, useEffect } from 'react';
import ProjectCard from '../components/ui/project-card';
import { supabase } from '../lib/supabase';

/**
 * ProjectsPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ProjectsPage />
 */
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;
        setProjects(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Projects</h1>
        <p className="mt-2 text-muted-foreground">
          제가 작업한 모든 프로젝트를 확인해보세요
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">프로젝트를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">오류가 발생했습니다: {error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 등록된 프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              techStack={project.tech_stack}
              detailUrl={project.detail_url}
              thumbnailUrl={project.thumbnail_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
