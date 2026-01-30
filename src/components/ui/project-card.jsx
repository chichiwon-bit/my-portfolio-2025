import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { cn } from '../../lib/utils';

/**
 * TechBadge 컴포넌트
 *
 * Props:
 * @param {string} tech - 기술 스택 이름 [Required]
 *
 * Example usage:
 * <TechBadge tech="React" />
 */
function TechBadge({ tech }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
      {tech}
    </span>
  );
}

/**
 * ProjectCard 컴포넌트
 *
 * Props:
 * @param {string} title - 프로젝트 제목 [Required]
 * @param {string} description - 프로젝트 설명 [Required]
 * @param {string[]} techStack - 기술 스택 배열 [Required]
 * @param {string} detailUrl - 프로젝트 링크 [Required]
 * @param {string} thumbnailUrl - 썸네일 이미지 URL [Optional]
 * @param {string} className - 추가 CSS 클래스 [Optional]
 *
 * Example usage:
 * <ProjectCard
 *   title="My Project"
 *   description="프로젝트 설명"
 *   techStack={['React', 'Supabase']}
 *   detailUrl="https://example.com"
 *   thumbnailUrl="https://image.thum.io/get/https://example.com"
 * />
 */
function ProjectCard({
  title,
  description,
  techStack = [],
  detailUrl,
  thumbnailUrl,
  className
}) {
  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={`${title} 썸네일`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                <span class="text-sm">이미지 로딩 중...</span>
              </div>
            `;
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <a
            href={detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={`${title} 사이트 열기`}
          >
            <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;
