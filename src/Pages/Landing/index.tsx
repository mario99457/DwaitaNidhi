import { 
  Box, 
  useMediaQuery, 
  useTheme, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Chip,
  Avatar,
  LinearProgress,
  Button,
  Stack,
  Divider
} from "@mui/material";
import card1Img from "../../assets/LandingPageCards/Variant1.png";
import card2Img from "../../assets/LandingPageCards/Variant2.png";
import card3Img from "../../assets/LandingPageCards/Variant3.png";
import { 
  TrendingUp, 
  Book, 
  PlayArrow, 
  Favorite, 
  Share, 
  Search,
  Person,
  Schedule,
  Star,
  Visibility,
  Add,
  Bookmark,
  History,
  LibraryBooks,
  Comment,
  AudioFile,
  Translate
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/effect-coverflow";
import "./landing.scss";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";
import HomePageCard from "../../Components/HomePageCard";
import HomePageCardSmall from "../../Components/HomePageCard/HomePageCardSmall";
import { useState } from "react";
import CachedData from "../../Services/Common/GlobalServices";
import { Book as BookType } from "../../types/Context.type";

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState('trending');

  // Dashboard data
  const trendingShlokas = [
    {
      id: 1,
      title: "ज्ञानानन्दं देव निर्मलस्फटिकाकृतिं",
      author: "श्रीमद्वादिराजतीर्थाः",
      views: 12450,
      likes: 892,
      duration: "2:34",
      category: "Vedanta",
      rating: 4.8
    },
    {
      id: 2,
      title: "वेदव्यास! गुणावास! विद्याधीश! सतां वश",
      author: "श्रीमद्वादिराजतीर्थाः",
      views: 9876,
      likes: 654,
      duration: "1:45",
      category: "Philosophy",
      rating: 4.6
    },
    {
      id: 3,
      title: "अभ्रमं भङ्गरहितं अजडं विमलं सदा",
      author: "श्रीव्यासराजतीर्थाः",
      views: 15678,
      likes: 1234,
      duration: "3:12",
      category: "Meditation",
      rating: 4.9
    }
  ];

  const recentActivities = [
    { user: "Rahul S", action: "completed", item: "Bhagavad Gita Chapter 1", time: "2 hours ago" },
    { user: "Priya M", action: "bookmarked", item: "Vedanta Sutras", time: "4 hours ago" },
    { user: "Amit K", action: "started", item: "Upanishads Study", time: "6 hours ago" },
    { user: "Sita R", action: "shared", item: "Brahma Sutras", time: "8 hours ago" }
  ];

  // Books and Commentaries Insights
  const booksData = CachedData.data.books || [];
  
  const booksInsights = {
    totalBooks: booksData.length,
    sarvamoolaBooks: booksData.filter((book: BookType) => book.name.includes('sarvamoola')).length,
    otherBooks: booksData.filter((book: BookType) => !book.name.includes('sarvamoola')).length,
    booksWithAudio: booksData.filter((book: BookType) => book.audio).length,
    searchableBooks: booksData.filter((book: BookType) => book.searchable).length,
    totalCommentaries: booksData.reduce((total: number, book: BookType) => 
      total + (book.commentaries?.length || 0), 0),
    averageCommentariesPerBook: booksData.length > 0 ? 
      (booksData.reduce((total: number, book: BookType) => 
        total + (book.commentaries?.length || 0), 0) / booksData.length).toFixed(1) : 0
  };

  const statistics = [
    { label: "Total Shlokas", value: "10,847", icon: <Book />, color: "#4CAF50" },
    { label: "Active Users", value: "2,341", icon: <Person />, color: "#2196F3" },
    { label: "Study Hours", value: "15,234", icon: <Schedule />, color: "#FF9800" },
    { label: "Bookmarks", value: "8,567", icon: <Favorite />, color: "#E91E63" }
  ];

  const booksStatistics = [
    { label: "Total Books", value: booksInsights.totalBooks.toString(), icon: <LibraryBooks />, color: "#9C27B0" },
    { label: "Sarvamoola", value: booksInsights.sarvamoolaBooks.toString(), icon: <Book />, color: "#4CAF50" },
    { label: "Commentaries", value: booksInsights.totalCommentaries.toString(), icon: <Comment />, color: "#2196F3" },
    { label: "Audio Books", value: booksInsights.booksWithAudio.toString(), icon: <AudioFile />, color: "#FF9800" }
  ];

  const studyProgress = {
    completed: 45,
    total: 100,
    currentBook: "Bhagavad Gita",
    currentChapter: "Chapter 2"
  };

  const topBooks = booksData
    .sort((a: BookType, b: BookType) => (b.commentaries?.length || 0) - (a.commentaries?.length || 0))
    .slice(0, 5);

  const commentaryInsights: { [key: string]: number } = booksData.reduce((acc: { [key: string]: number }, book: BookType) => {
    if (book.commentaries) {
      book.commentaries.forEach((commentary: any) => {
        if (!acc[commentary.author]) {
          acc[commentary.author] = 0;
        }
        acc[commentary.author]++;
      });
    }
    return acc;
  }, {});

  const cards = [
    {
      image: card1Img,
      title: "Card 1",
      quote: isMobile ? "" :
        "ज्ञानानन्दं देव निर्मलस्फटिकाकृतिं ।\nआधारं सर्वविद्यानां हयग्रीवनुपास्महे ॥",
      author: isMobile ? "" : "-श्रीमद्वादिराजतीर्थाः",
      style: {
        background: "#4D0301",
        Height: "70vw",
      },
    },
    {
      image: card2Img,
      title: "Card 2",
      quote: isMobile ? "" :
        "वेदव्यास! गुणावास! विद्याधीश! सतां वश।\nमां निराशं गतक्लेशं कुर्वनाशं हरेsनिशम् ॥",
      author: isMobile ? "" : "-श्रीमद्वादिराजतीर्थाः",
      style: {
        background: "#4D0301",
        Height: "70vw",
      },
    },
    {
      image: card3Img,
      title: "Card 3",
      quote: isMobile ? "" :
        "अभ्रमं भङ्गरहितं अजडं विमलं सदा |\nआनन्दतीर्थमतुलं भजे तापत्रयापहम् || ",
      author: isMobile ? "" : "-श्रीव्यासराजतीर्थाः",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #417F1B 0%, #284E03 100%)",
      },
    }
  ];

  const renderDashboard = () => (
    <Box className="dashboard-container" sx={{ p: isMobile ? 2 : 4, height: '100%', overflowY: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600, mb: 1 }}>
          Welcome to Dwaita Nidhi
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Explore the timeless wisdom of Vedanta and Dvaita philosophy
        </Typography>
        
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Search />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Search Shlokas
          </Button>
          <Button
            variant="outlined"
            startIcon={<Bookmark />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            My Bookmarks
          </Button>
          <Button
            variant="outlined"
            startIcon={<History />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Study History
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statistics.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card className="statistics-card" sx={{ 
              background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
              border: `1px solid ${stat.color}30`,
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 1,
                  color: stat.color 
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Books Statistics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          📚 Library Insights
        </Typography>
        <Grid container spacing={3}>
          {booksStatistics.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card className="statistics-card" sx={{ 
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 1,
                    color: stat.color 
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1}>
          {['trending', 'recent', 'featured', 'insights'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "contained" : "outlined"}
              size="small"
              onClick={() => setActiveTab(tab)}
              sx={{ 
                textTransform: 'capitalize',
                borderRadius: 2,
                px: 3
              }}
            >
              {tab}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Study Progress */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Study Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body2">
              {studyProgress.currentBook} - {studyProgress.currentChapter}
            </Typography>
            <Chip 
              label={`${studyProgress.completed}/${studyProgress.total}`} 
              size="small" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(studyProgress.completed / studyProgress.total) * 100}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Content Sections */}
      {activeTab === 'trending' && (
        <Grid container spacing={3}>
          {/* Trending Shlokas */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUp sx={{ mr: 1, color: '#FF6B35' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Trending Shlokas
                  </Typography>
                </Box>
                <Stack spacing={2}>
                                     {trendingShlokas.map((shloka, index) => (
                     <Box key={shloka.id} className="trending-shloka" sx={{ 
                       p: 2, 
                       border: '1px solid #e0e0e0', 
                       borderRadius: 2,
                       '&:hover': { backgroundColor: '#f5f5f5' }
                     }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
                          {shloka.title}
                        </Typography>
                        <Chip 
                          label={shloka.category} 
                          size="small" 
                          sx={{ backgroundColor: '#E3F2FD' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        - {shloka.author}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Visibility fontSize="small" color="action" />
                          <Typography variant="caption">{shloka.views}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Favorite fontSize="small" color="action" />
                          <Typography variant="caption">{shloka.likes}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star fontSize="small" sx={{ color: '#FFD700' }} />
                          <Typography variant="caption">{shloka.rating}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule fontSize="small" color="action" />
                          <Typography variant="caption">{shloka.duration}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <IconButton size="small" sx={{ backgroundColor: '#E3F2FD' }}>
                          <PlayArrow fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ backgroundColor: '#FFF3E0' }}>
                          <Favorite fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ backgroundColor: '#E8F5E8' }}>
                          <Share fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Recent Activities
                </Typography>
                <Stack spacing={2}>
                                     {recentActivities.map((activity, index) => (
                     <Box key={index} className="activity-item" sx={{ 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: 2,
                       p: 1,
                       borderRadius: 1,
                       '&:hover': { backgroundColor: '#f5f5f5' }
                     }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                        {activity.user.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.action} {activity.item}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 'recent' && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Recently Studied
            </Typography>
            <Grid container spacing={2}>
              {cards.slice(0, 3).map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ 
                    height: 200, 
                    background: `linear-gradient(135deg, ${card.style?.background || '#f5f5f5'})`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {card.quote}
                      </Typography>
                      <Typography variant="caption">
                        {card.author}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 'featured' && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Featured Collections
          </Typography>
          <Swiper
            spaceBetween={16}
            slidesPerView={isMobile ? 1 : 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="featured-swiper"
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index}>
                {isMobile ? (
                  <HomePageCardSmall
                    image={card.image}
                    quote={card.quote}
                    author={card.author}
                    style={card.style}
                  />
                ) : (
                  <HomePageCard
                    image={card.image}
                    quote={card.quote}
                    author={card.author}
                    style={card.style}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}

      {activeTab === 'insights' && (
        <Grid container spacing={3}>
          {/* Top Books by Commentaries */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LibraryBooks sx={{ mr: 1, color: '#9C27B0' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Top Books by Commentaries
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  {topBooks.map((book: BookType, index: number) => (
                    <Box key={book.name} sx={{ 
                      p: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
                          {book.title}
                        </Typography>
                        <Chip 
                          label={`${book.commentaries?.length || 0} commentaries`} 
                          size="small" 
                          sx={{ backgroundColor: '#E8F5E8', color: '#2E7D32' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {book.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {book.audio && (
                          <Chip 
                            label="Audio Available" 
                            size="small" 
                            icon={<AudioFile fontSize="small" />}
                            sx={{ backgroundColor: '#FFF3E0', color: '#E65100' }}
                          />
                        )}
                        {book.searchable && (
                          <Chip 
                            label="Searchable" 
                            size="small" 
                            icon={<Search fontSize="small" />}
                            sx={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Commentary Authors */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Comment sx={{ mr: 1, color: '#2196F3' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Commentary Authors
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  {Object.entries(commentaryInsights)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 8)
                    .map(([author, count]: [string, number]) => (
                    <Box key={author} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#2196F3' }}>
                        {author.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {count} commentaries
                        </Typography>
                      </Box>
                      <Chip 
                        label={count.toString()} 
                        size="small" 
                        sx={{ backgroundColor: '#E3F2FD' }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📊 Detailed Library Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: '#9C27B0' }}>
                        {booksInsights.totalBooks}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Books
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                        {booksInsights.sarvamoolaBooks}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sarvamoola Books
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: '#2196F3' }}>
                        {booksInsights.totalCommentaries}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Commentaries
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: '#FF9800' }}>
                        {booksInsights.averageCommentariesPerBook}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Commentaries/Book
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: '100%' }}>
      {renderDashboard()}
    </Box>
  );
};

export default Landing;
