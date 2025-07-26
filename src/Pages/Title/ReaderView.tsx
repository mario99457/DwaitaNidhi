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
}

const ReaderView: React.FC<ReaderViewProps> = ({ titles, commentaryScript, toc }) => {
  // Helper to get titles for a chapter/subchapter
  const getTitles = (a: string, p: string) =>
    titles.filter((t) => t.a === a && t.p === p);

  // Collapsible state: only one chapter open at a time
  const [openChapter, setOpenChapter] = useState<string | null>(toc[0]?.n || null);

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

  if (!toc || toc.length === 0) {
    // Render all titles as a single block if there are no chapters
    return (
      <Box sx={{
        background: '#FFF9F2',
        borderRadius: 2,
        padding: { xs: 2, md: 4 },
        maxWidth: '900px',
        margin: '0 auto',
        boxShadow: 1,
      }}>
        {titles.map((title) => (
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
            }}
          >
            <span style={{ color: '#BC4501', fontWeight: 600, marginRight: 12 }}>
              {Formatter.toDevanagariNumeral(title.n)}
            </span>
            {Sanscript.t(Formatter.formatVyakhya(title.s), 'devanagari', commentaryScript || 'devanagari')
              .split('\n')
              .map((line, idx) => (
                <div key={idx} style={{ whiteSpace: 'pre-line' }}>{line}</div>
              ))}
          </Typography>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <Box
        sx={{
          minWidth: 220,
          maxWidth: 260,
          mr: 3,
          position: 'sticky',
          top: 24,
          alignSelf: 'flex-start',
          background: '#FFF9F2',
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
          height: 'fit-content',
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
        maxWidth: '900px',
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
                            // fontFamily removed, use default
                          }}
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
                        // fontFamily removed, use default
                      }}
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