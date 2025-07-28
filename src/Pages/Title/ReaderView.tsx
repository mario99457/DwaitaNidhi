import React from "react";
import { Box, Typography } from "@mui/material";
import { Title } from "../../types/GlobalType.type";
import Sanscript from '@indic-transliteration/sanscript';
import Formatter from "../../Services/Common/Formatter";
import { Chapters } from "../../types/Context.type";
import { useState, useEffect } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ReaderViewProps {
  titles: Title[];
  commentaryScript: string;
  toc: Chapters[];
  handleTitleClick: (selectedTitle: Title) => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ titles, commentaryScript, toc, handleTitleClick }) => {
  // Helper to get titles for a chapter/subchapter
  const getTitles = (a: string, p: string) =>
    titles.filter((t) => {
      if (p) {
        return t.a === a && t.p === p;
      } else {
        return t.a === a && (t.p === undefined || t.p === "");
      }
    });

  // Check if any titles match the chapter structure
  const hasMatchingTitles = () => {
    if (!toc || toc.length === 0) return false;
    
    for (const chapter of toc) {
      if (chapter.sub && chapter.sub.length > 0) {
        for (const sub of chapter.sub) {
          if (getTitles(chapter.n, sub.n).length > 0) {
            return true;
          }
        }
      } else {
        if (getTitles(chapter.n, '').length > 0) {
          return true;
        }
      }
    }
    return false;
  };

  // Collapsible state: only one chapter open at a time
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  // Initialize openChapter after checking if toc exists and has chapters
  useEffect(() => {
    if (toc && toc.length > 0) {
      setOpenChapter(toc[0]?.n || null);
    }
  }, [toc]);

  // Scroll to chapter after openChapter changes
  useEffect(() => {
    if (openChapter) {
      const el = document.getElementById(`chapter-${openChapter}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [openChapter]);

  // Handler for toggling chapters
  const handleToggleChapter = (chapterNum: string) => {
    setOpenChapter((prev) => (prev === chapterNum ? null : chapterNum));
  };

  if (!toc || toc.length === 0 || !hasMatchingTitles()) {
    // Render all titles as a single block if there are no chapters or no titles match chapter structure
    return (
      <Box sx={{
        background: '#FFF9F2',
        borderRadius: 2,
        padding: { xs: 2, md: 4 },
        maxWidth: '900px',
        margin: '0 auto',
        boxShadow: 1,
      }}>
        <Typography
          component="div"
          sx={{
            fontSize: { xs: '1.35rem', md: '1.6rem' },
            lineHeight: 1.85,
            color: '#3A2C1A',
            textAlign: 'justify',
            background: '#FFF',
            borderRadius: 1,
            padding: { xs: 1.5, md: 3 },
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {titles.map((title, index) => (
            <React.Fragment key={title.i}>
              <div
                style={{
                  cursor: 'pointer',
                  padding: '8px 0',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                  },
                }}
                onClick={() => handleTitleClick(title)}
                data-title-id={title.i}
              >
                {title?.a && title?.n && (
                  <span style={{ color: '#BC4501', fontWeight: 600, marginRight: 12 }}>
                    {Formatter.toDevanagariNumeral(`${title?.a}${title?.p ? `.${title?.p}` : ''}.${title?.n}`)}
                  </span>
                )}
                {Sanscript.t(Formatter.formatVyakhya(title.s), 'devanagari', commentaryScript || 'devanagari')
                  .split('\n')
                  .map((line, idx) => (
                    <span key={idx} style={{ whiteSpace: 'pre-line' }}>{line}</span>
                  ))}
              </div>
              {index < titles.length - 1 && <br />}
            </React.Fragment>
          ))}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start',
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 2, md: 3 }
    }}>
      {/* Sidebar */}
      <Box
        sx={{
          minWidth: { xs: '100%', md: 220 },
          maxWidth: { xs: '100%', md: 260 },
          mr: { xs: 0, md: 3 },
          position: 'sticky',
          top: 24,
          alignSelf: 'flex-start',
          background: '#FFF9F2',
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
          height: 'fit-content',
          display: { xs: 'none', md: 'block' }, // Hide sidebar on mobile
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#BC4501', fontWeight: 700, fontSize: '1.1rem' }}>
          {'अध्यायः'}
        </Typography>
        <nav>
          {toc.map((chapter) => (
            <Box key={chapter.n} sx={{ mb: 1 }}>
              <a
                href={`#chapter-${chapter.n}`}
                style={{
                  display: 'block',
                  color: '#A74600',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: 2,
                  fontSize: '1rem',
                  padding: '2px 0',
                  cursor: 'pointer',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '100%',
                }}
                onClick={e => {
                  e.preventDefault();
                  setOpenChapter(prev => prev === chapter.n ? null : chapter.n);
                }}
              >
                {/* Sidebar chapter name */}
                {commentaryScript === 'devanagari'
                  ? chapter.name
                  : Sanscript.t(chapter.name, 'devanagari', commentaryScript)}
              </a>
              {chapter.sub && chapter.sub.length > 0 && (
                <Box sx={{ ml: 4 }}>
                  {chapter.sub.map((sub) => (
                    <a
                      key={sub.n}
                      href={`#chapter-${chapter.n}-sub-${sub.n}`}
                      style={{
                        display: 'block',
                        color: '#BC4501',
                        fontWeight: 500,
                        textDecoration: 'none',
                        fontSize: '0.97rem',
                        marginBottom: 1,
                        padding: '2px 0',
                        cursor: 'pointer',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        maxWidth: '100%',
                      }}
                      onClick={e => {
                        e.preventDefault();
                        setOpenChapter(chapter.n);
                        const el = document.getElementById(`chapter-${chapter.n}-sub-${sub.n}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {/* Sidebar subchapter name */}
                      {commentaryScript === 'devanagari'
                        ? sub.name
                        : Sanscript.t(sub.name, 'devanagari', commentaryScript)}
                    </a>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </nav>
      </Box>
      {/* Main Content */}
      <Box sx={{
        background: '#FFF9F2',
        borderRadius: 2,
        padding: { xs: 2, md: 4 },
        width: '100%',
        flex: 1,
        margin: '0 auto',
        boxShadow: 1,
        // fontFamily removed, use default
      }}>
        {toc.map((chapter) => (
          <Box key={chapter.n} sx={{ mb: 4 }}>
            <Box
              id={`chapter-${chapter.n}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                mb: 2,
                scrollMarginTop: '80px',
              }}
              onClick={() => handleToggleChapter(chapter.n)}
            >
              {openChapter === chapter.n ? <ExpandMoreIcon fontSize="large" /> : <ChevronRightIcon fontSize="large" />}
              <Typography
                variant="h4"
                sx={{
                  color: '#A74600',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: 1,
                  ml: 1,
                }}
              >
                {/* Main content chapter heading */}
                {commentaryScript === 'devanagari'
                  ? chapter.name
                  : Sanscript.t(chapter.name, 'devanagari', commentaryScript)}
              </Typography>
            </Box>
            {openChapter === chapter.n && (
              <>
                {chapter.sub && chapter.sub.length > 0 ? (
                  chapter.sub.map((sub) => (
                    <Box key={sub.n} sx={{ mb: 3, ml: 3 }}>
                      <Typography
                        id={`chapter-${chapter.n}-sub-${sub.n}`}
                        variant="h5"
                        sx={{
                          color: '#BC4501',
                          fontWeight: 600,
                          mb: 1.5,
                          fontSize: { xs: '1.2rem', md: '1.4rem' },
                          scrollMarginTop: '80px',
                        }}
                      >
                        {/* Main content subchapter heading */}
                        {commentaryScript === 'devanagari'
                          ? sub.name
                          : Sanscript.t(sub.name, 'devanagari', commentaryScript)}
                      </Typography>
                      {getTitles(chapter.n, sub.n).map((title) => (
                        <Typography
                          key={title.i}
                          component="div"
                          sx={{
                            fontSize: { xs: '1.35rem', md: '1.6rem' },
                            lineHeight: 1.85,
                            marginBottom: 3,
                            color: '#3A2C1A',
                            textAlign: 'justify',
                            background: '#FFF',
                            borderRadius: 1,
                            padding: { xs: 1.5, md: 3 },
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#F5F5F5',
                            },
                            // fontFamily removed, use default
                          }}
                          onClick={() => handleTitleClick(title)}
                          data-title-id={title.i}
                        >
                          <span style={{ color: '#BC4501', fontWeight: 600, marginRight: 12 }}>
                            {Formatter.toDevanagariNumeral(`${title?.a}${title?.p ? `.${title?.p}` : ''}.${title?.n}`)}
                          </span>
                          {Sanscript.t(Formatter.formatVyakhya(title.s), 'devanagari', commentaryScript || 'devanagari')
                            .split('\n')
                            .map((line, idx) => (
                              <div key={idx} style={{ whiteSpace: 'pre-line' }}>{line}</div>
                            ))}
                        </Typography>
                      ))}
                    </Box>
                  ))
                ) : (
                  getTitles(chapter.n, '').map((title) => (
                    <Typography
                      key={title.i}
                      component="div"
                      sx={{
                        fontSize: { xs: '1.35rem', md: '1.6rem' },
                        lineHeight: 1.85,
                        marginBottom: 3,
                        color: '#3A2C1A',
                        textAlign: 'justify',
                        background: '#FFF',
                        borderRadius: 1,
                        padding: { xs: 1.5, md: 3 },
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#F5F5F5',
                        },
                        // fontFamily removed, use default
                      }}
                      onClick={() => handleTitleClick(title)}
                      data-title-id={title.i}
                    >
                      <span style={{ color: '#BC4501', fontWeight: 600, marginRight: 12 }}>
                        {Formatter.toDevanagariNumeral(`${title?.a}${title?.p ? `.${title?.p}` : ''}.${title?.n}`)}
                      </span>
                      {Sanscript.t(Formatter.formatVyakhya(title.s), 'devanagari', commentaryScript || 'devanagari')
                        .split('\n')
                        .map((line, idx) => (
                          <div key={idx} style={{ whiteSpace: 'pre-line' }}>{line}</div>
                        ))}
                    </Typography>
                  ))
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReaderView; 