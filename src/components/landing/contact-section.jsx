import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { Mail, Github, Linkedin, Twitter, Send, User, Briefcase, Calendar } from 'lucide-react';

/**
 * ContactSection 컴포넌트
 *
 * Props:
 * @param {string} className - 추가 CSS 클래스 [Optional]
 *
 * Example usage:
 * <ContactSection />
 */
function ContactSection({ className }) {
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    message: '',
    occupation: '',
    email: '',
    isEmailPublic: false,
  });

  // 방명록 데이터 로드
  useEffect(() => {
    fetchGuestbook();
  }, []);

  const fetchGuestbook = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGuestbookEntries(data);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.authorName.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('guestbook').insert({
      author_name: formData.authorName.trim(),
      message: formData.message.trim(),
      occupation: formData.occupation.trim() || null,
      email: formData.email.trim() || null,
      is_email_public: formData.isEmailPublic,
    });

    if (!error) {
      setFormData({
        authorName: '',
        message: '',
        occupation: '',
        email: '',
        isEmailPublic: false,
      });
      fetchGuestbook();
    }

    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  ];

  return (
    <section id="contact" className={`py-12 md:py-24 ${className || ''}`}>
      {/* 섹션 타이틀 */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
        Contact
      </h2>

      {/* 연락처 카드 */}
      <Card className="mb-8 border-gray-200 bg-white">
        <CardContent className="p-6 md:p-8">
          {/* 이메일 */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-gray-600" />
            <a
              href="mailto:contact@example.com"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              contact@example.com
            </a>
          </div>

          {/* SNS 아이콘 */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-gray-700" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 방명록 섹션 */}
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Guestbook
          </h3>

          {/* 방명록 작성 폼 */}
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            {/* 이름 (필수) */}
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            {/* 메시지 (필수) */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="메시지를 남겨주세요"
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none bg-white text-gray-900"
              />
            </div>

            {/* 직업 (선택) */}
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                직업 <span className="text-gray-400">(선택)</span>
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="직업 또는 소속"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            {/* 이메일 (선택) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일 <span className="text-gray-400">(선택)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일 주소"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            {/* 이메일 공개 여부 */}
            {formData.email && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEmailPublic"
                  name="isEmailPublic"
                  checked={formData.isEmailPublic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-400"
                />
                <label htmlFor="isEmailPublic" className="text-sm text-gray-600">
                  이메일을 공개합니다
                </label>
              </div>
            )}

            {/* 제출 버튼 */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                '작성 중...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  방명록 남기기
                </>
              )}
            </Button>
          </form>

          {/* 방명록 목록 */}
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500 py-8">불러오는 중...</p>
            ) : guestbookEntries.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                아직 방명록이 없습니다. 첫 번째 방명록을 남겨주세요!
              </p>
            ) : (
              guestbookEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{entry.author_name}</span>
                    {entry.occupation && (
                      <>
                        <Briefcase className="w-4 h-4 text-gray-400 ml-2" />
                        <span className="text-sm text-gray-600">{entry.occupation}</span>
                      </>
                    )}
                  </div>

                  {/* 메시지 */}
                  <p className="text-gray-700 mb-2 whitespace-pre-wrap">{entry.message}</p>

                  {/* 하단 정보 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(entry.created_at)}</span>
                    </div>
                    {entry.is_email_public && entry.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <a
                          href={`mailto:${entry.email}`}
                          className="hover:text-gray-700 transition-colors"
                        >
                          {entry.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default ContactSection;
