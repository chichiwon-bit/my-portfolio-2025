import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import ProjectCard from '../ui/project-card';
import { supabase } from '../../lib/supabase';

/**
 * ProjectsSection 컴포넌트
 *
 * Props:
 * @param {string} className - 추가 CSS 클래스 [Optional]
 * @param {number} limit - 표시할 프로젝트 수 [Optional, 기본값: 4]
 *
 * Example usage:
 * <ProjectsSection limit={3} />
 */
function ProjectsSection({ className, limit = 4 }) {
  const navigate = useNavigate();
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
          .order('sort_order', { ascending: true })
          .limit(limit);

        if (fetchError) throw fetchError;
        setProjects(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [limit]);

  return (
    <section className={`py-12 md:py-24 ${className || ''}`}>
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">Projects</h2>
        <p className="mt-2 text-muted-foreground">
          제가 작업한 프로젝트들입니다
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="text-center mt-8">
        <Button
          variant="outline"
          onClick={() => navigate('/projects')}
        >
          전체 프로젝트 보기
        </Button>
      </div>
    </section>
  );
}

export default ProjectsSection;
