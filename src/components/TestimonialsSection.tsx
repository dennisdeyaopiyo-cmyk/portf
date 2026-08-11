import React, { useState } from 'react';
import { Star, MessageSquarePlus, ChevronLeft, ChevronRight, Pause, Play, Quote, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onAddTestimonial,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [rating, setRating] = useState(5.0);
  const [quote, setQuote] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || !authorName.trim()) return;

    onAddTestimonial({
      rating: Number(rating),
      quote: quote.trim(),
      authorName: authorName.trim(),
      authorTitle: authorTitle.trim() || 'Client & Reviewer',
      authorAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      date: 'Just now',
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
      setQuote('');
      setAuthorName('');
      setAuthorTitle('');
    }, 1500);
  };

  // Duplicate items twice to create seamless loop marquee right-to-left
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-slate-950/80 border-t border-slate-800/60">
      {/* Background ambient glowing green/cyan spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#20e8db]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Recommendations & Feedback</span>
            </div>
            
            {/* Heading matching screenshot style */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <span className="text-[#20e8db] font-black mr-2.5">What</span>
              They Say
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Authentic reviews, client feedback, and academic endorsements on my engineering discipline and work quality.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#20e8db] hover:border-[#20e8db]/40 transition-colors"
              title={isPaused ? "Resume Autoplay" : "Pause Autoplay"}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-[#20e8db]/20 border border-[#20e8db]/40 text-[#20e8db] font-semibold text-xs sm:text-sm hover:bg-[#20e8db]/30 transition-all flex items-center space-x-2 shadow-lg shadow-[#20e8db]/10"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Continuous Right-to-Left Slider */}
      <div 
        className="relative w-full overflow-hidden py-4 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right gradient fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div 
          className="animate-marquee-left flex space-x-6"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[300px] sm:w-[380px] shrink-0 p-6 sm:p-7 rounded-3xl bg-[#09181b] border border-[#1b3b40] shadow-2xl relative flex flex-col justify-between hover:border-[#20e8db]/60 transition-all hover:-translate-y-1 group/card"
            >
              {/* Subtle background glow inside card */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0e2c31]/40 via-transparent to-transparent pointer-events-none" />

              <div>
                {/* Rating score + Stars row */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-[#20e8db] font-extrabold text-base sm:text-lg">
                    {item.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#20e8db] fill-[#20e8db]"
                      />
                    ))}
                  </div>
                </div>

                {/* Quote text */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  "{item.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/60 mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#20e8db]/40 bg-slate-900 shrink-0">
                  <img
                    src={item.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                    alt={item.authorName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm group-hover/card:text-[#20e8db] transition-colors">
                    {item.authorName}
                  </h4>
                  {item.authorTitle && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      {item.authorTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Quote className="w-5 h-5 text-[#20e8db]" />
                <span>Leave a Recommendation</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-lg font-bold text-white">Thank you for your feedback!</p>
                <p className="text-xs text-slate-400">Your recommendation has been added to Dennis's portfolio.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-[#20e8db] fill-[#20e8db]'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-[#20e8db] ml-2">
                      {rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#20e8db]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Your Title / Role
                  </label>
                  <input
                    type="text"
                    value={authorTitle}
                    onChange={(e) => setAuthorTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer / Client"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#20e8db]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Your Feedback / Recommendation *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Write your experience working with Dennis..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#20e8db]"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#20e8db] hover:bg-[#1bd1c5] text-slate-950 text-sm font-bold transition-all shadow-lg shadow-[#20e8db]/20"
                  >
                    Submit Recommendation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
