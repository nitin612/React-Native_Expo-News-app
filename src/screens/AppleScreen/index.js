import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Share,
  Animated
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/ThemeContext';

const { width, height } = Dimensions.get('window');

// Wrapper component to use hooks
const AppleScreenWrapper = (props) => {
  const theme = useTheme();
  return <AppleScreen {...props} theme={theme} />;
};

// Article Detail Screen Component
class ArticleDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0)
    };
    
    // Animation values for opening/closing
    this.slideAnim = new Animated.Value(height);
    this.opacityAnim = new Animated.Value(0);
    this.scaleAnim = new Animated.Value(0.9);
  }

  componentDidMount() {
    // Animate in when component mounts
    this.animateIn();
  }

  animateIn = () => {
    Animated.parallel([
      Animated.timing(this.slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(this.opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  animateOut = () => {
    Animated.parallel([
      Animated.timing(this.slideAnim, {
        toValue: height,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(this.opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this.scaleAnim, {
        toValue: 0.9,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Call onBack after animation completes
      this.props.onBack();
    });
  };

  handleBack = () => {
    this.animateOut();
  };

  shareArticle = async () => {
    try {
      await Share.share({
        message: `${this.props.article.title}\n\n${this.props.article.url}`,
        url: this.props.article.url,
        title: this.props.article.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  render() {
    const { article, theme } = this.props;
    const { colors } = theme;
    const { scrollY } = this.state;

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const imageTranslateY = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [0, -150],
      extrapolate: 'clamp',
    });

    const imageScale = scrollY.interpolate({
      inputRange: [-100, 0],
      outputRange: [1.2, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[
        styles.detailContainer,
        { backgroundColor: colors.background },
        {
          transform: [
            { translateY: this.slideAnim },
            { scale: this.scaleAnim }
          ],
          opacity: this.opacityAnim,
        }
      ]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor="transparent" translucent />
        
        {/* Animated Header */}
        <Animated.View style={[styles.detailHeader, { opacity: headerOpacity }]}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle} numberOfLines={1}>
            {article.title}
          </Text>
          <TouchableOpacity style={styles.shareButton} onPress={this.shareArticle}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.ScrollView
          style={styles.detailScrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Hero Image */}
          <Animated.View style={styles.detailImageContainer}>
            <Animated.Image
              source={{ uri: article.urlToImage }}
              style={[
                styles.detailImage,
                {
                  transform: [
                    { translateY: imageTranslateY },
                    { scale: imageScale }
                  ]
                }
              ]}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.detailImageGradient}
            />
          </Animated.View>

          {/* Floating Action Buttons */}
          <View style={styles.floatingActions}>
            <TouchableOpacity style={styles.floatingButton} onPress={this.handleBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButton} onPress={this.shareArticle}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Article Content */}
          <View style={[styles.detailContent, { backgroundColor: colors.background }]}>
            <View style={styles.detailMeta}>
              <View style={styles.detailSourceContainer}>
                <Text style={[styles.detailSource, { color: colors.accent }]}>{article.source}</Text>
                <View style={[styles.sourceDivider, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.detailDate, { color: colors.secondary }]}>
                  {this.formatFullDate(article.date)}
                </Text>
              </View>
              {article.author && (
                <Text style={[styles.detailAuthor, { color: colors.secondary }]}>By {article.author}</Text>
              )}
            </View>

            <Text style={[styles.detailTitle, { color: colors.primary }]}>{article.title}</Text>
            
            {article.description && (
              <Text style={[styles.detailDescription, { color: colors.secondary }]}>{article.description}</Text>
            )}

            {/* Simulated Article Content */}
            <View style={styles.articleBody}>
              <Text style={[styles.bodyText, { color: colors.primary }]}>
                {article.description || "This is where the full article content would appear. In a real implementation, you would fetch the complete article content from your news API or use a web scraping service to extract the full text."}
              </Text>
              
              <Text style={[styles.bodyText, { color: colors.primary }]}>
                Apple continues to innovate and evolve, with new developments and trends emerging across their product ecosystem. Stay informed about the latest changes that could impact technology enthusiasts and Apple users worldwide.
              </Text>

              <Text style={[styles.bodyText, { color: colors.primary }]}>
                Market analysis shows various factors influencing Apple's position, from new product launches to software updates and market dynamics.
              </Text>

              {/* Read Full Article Button */}
              <TouchableOpacity 
                style={[styles.readFullButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                onPress={() => Linking.openURL(article.url)}
              >
                <Text style={[styles.readFullText, { color: colors.accent }]}>Read Full Article</Text>
                <Ionicons name="open-outline" size={18} color={colors.accent} style={styles.readFullIcon} />
              </TouchableOpacity>
            </View>

            {/* Tags */}
            <View style={[styles.tagsContainer, { borderTopColor: colors.border }]}>
              <Text style={[styles.tagsTitle, { color: colors.primary }]}>Related Topics</Text>
              <View style={styles.tags}>
                <View style={[styles.tag, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tagText}>Apple</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tagText}>Technology</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tagText}>Innovation</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </Animated.View>
    );
  }
}

// Main Apple Screen Component
class AppleScreen extends Component {
  state = {
    articles: [],
    isLoading: true,
    error: null,
    refreshing: false,
    activeCarouselIndex: 0,
    selectedArticle: null,
    showDetail: false
  };

  getArticles = () => {
    axios
      .get(
        "https://newsapi.org/v2/everything?q=apple&from=2025-07-18&to=2025-07-18&sortBy=popularity&apiKey=42f96ae7332147268cf9d2507b5681f2"
      )
      .then(response =>
        response.data.articles.map(article => ({
          date: article.publishedAt,
          title: article.title,
          url: article.url,
          description: article.description,
          urlToImage: article.urlToImage,
          source: article.source.name,
          author: article.author
        }))
      )
      .then(articles => {
        this.setState({
          articles: articles.filter(article => article.urlToImage),
          isLoading: false,
          refreshing: false
        });
      })
      .catch(error => 
        this.setState({ 
          error, 
          isLoading: false, 
          refreshing: false 
        })
      );
  };

  componentDidMount() {
    this.getArticles();
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getArticles();
  };

  formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${diff}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  onCarouselScroll = (event) => {
    const slideSize = width - 40;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== this.state.activeCarouselIndex) {
      this.setState({ activeCarouselIndex: index });
    }
  };

  openArticle = (article) => {
    this.setState({ 
      selectedArticle: article, 
      showDetail: true 
    });
  };

  closeArticle = () => {
    // This will be called after the close animation completes
    this.setState({ 
      showDetail: false, 
      selectedArticle: null 
    });
  };

  // Function to open drawer - you'll need to pass navigation prop from parent
  openDrawer = () => {
    if (this.props.navigation) {
      this.props.navigation.openDrawer();
    }
  };

  renderCarouselItem = ({ item, index }) => {
    const { colors } = this.props.theme;
    
    return (
      <TouchableOpacity
        style={[styles.carouselCard, { backgroundColor: colors.cardBackground }]}
        onPress={() => this.openArticle(item)}
        activeOpacity={0.95}
      >
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={colors.carouselGradient || ['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.carouselGradient}
        >
          <View style={styles.carouselContent}>
            <View style={styles.carouselMeta}>
              <Text style={styles.carouselSource}>{item.source}</Text>
              <Text style={styles.carouselDate}>{this.formatDate(item.date)}</Text>
            </View>
            <Text style={styles.carouselTitle} numberOfLines={3}>
              {item.title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  renderCarouselIndicators = () => {
    const { colors } = this.props.theme;
    const featuredArticles = this.state.articles.slice(0, 5);
    
    return (
      <View style={styles.indicatorContainer}>
        {featuredArticles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { backgroundColor: colors.border },
              index === this.state.activeCarouselIndex ? 
                [styles.activeIndicator, { backgroundColor: colors.accent }] : {}
            ]}
          />
        ))}
      </View>
    );
  };

  renderRegularArticle = (article, index) => {
    const { colors } = this.props.theme;
    
    return (
      <TouchableOpacity
        key={article.url + '_' + index}
        style={[styles.articleCard, { 
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border 
        }]}
        onPress={() => this.openArticle(article)}
        activeOpacity={0.7}
      >
        <View style={styles.articleContent}>
          <View style={styles.articleTextContainer}>
            <View style={styles.articleMeta}>
              <Text style={[styles.articleSource, { color: colors.accent }]}>{article.source}</Text>
              <Text style={[styles.articleDate, { color: colors.secondary }]}>{this.formatDate(article.date)}</Text>
            </View>
            <Text style={[styles.articleTitle, { color: colors.primary }]} numberOfLines={3}>
              {article.title}
            </Text>
            <Text style={[styles.articleDescription, { color: colors.secondary }]} numberOfLines={2}>
              {article.description}
            </Text>
          </View>
          <View style={styles.articleImageContainer}>
            <Image
              source={{ uri: article.urlToImage }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { isLoading, articles, refreshing, error, showDetail, selectedArticle } = this.state;
    const { colors, isDarkMode, toggleTheme } = this.props.theme;

    if (error) {
      return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.primary }]}>Failed to load news</Text>
            <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.accent }]} onPress={this.getArticles}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const featuredArticles = articles.slice(0, 5);
    const regularArticles = articles.slice(5);

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        
        {/* Updated Header with Left-aligned text and Right-aligned Drawer Button */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.primary }]}>Apple News</Text>
              <Text style={[styles.headerSubtitle, { color: colors.secondary }]}>Stay updated with the latest</Text>
            </View>
            <TouchableOpacity 
              style={[styles.drawerButton, { backgroundColor: colors.cardBackground }]} 
              onPress={this.openDrawer}
            >
              <Ionicons name="menu-outline" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.loading }]}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.secondary }]}>Loading latest news...</Text>
          </View>
        ) : (
          <ScrollView
            style={[styles.scrollView, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                tintColor={colors.accent}
              />
            }
          >
            {featuredArticles.length > 0 && (
              <>
                <Text style={[styles.carouselHeader, { color: colors.primary }]}>Featured Stories</Text>
                <FlatList
                  data={featuredArticles}
                  renderItem={this.renderCarouselItem}
                  keyExtractor={(item, index) => item.url + '_carousel_' + index}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={width - 40}
                  decelerationRate="fast"
                  contentContainerStyle={styles.carouselContainer}
                  onScroll={this.onCarouselScroll}
                  scrollEventThrottle={16}
                />
                {this.renderCarouselIndicators()}
              </>
            )}
            
            <View style={[styles.sectionHeader, { 
              backgroundColor: colors.sectionBackground,
              borderBottomColor: colors.border 
            }]}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>More Stories</Text>
            </View>
            
            {regularArticles.map((article, index) => 
              this.renderRegularArticle(article, index)
            )}
            
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}

        {/* Render Detail Screen as Overlay */}
        {showDetail && selectedArticle && (
          <ArticleDetailScreen
            article={selectedArticle}
            onBack={this.closeArticle}
            theme={this.props.theme}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  drawerButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 25,
  },
  retryButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Carousel Styles
  carouselHeader: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  carouselContainer: {
    paddingHorizontal: 20,
  },
  carouselCard: {
    width: width - 40,
    height: 280,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    justifyContent: 'flex-end',
  },
  carouselContent: {
    padding: 20,
  },
  carouselMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  carouselSource: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
    textTransform: 'uppercase',
  },
  carouselDate: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 8,
    opacity: 0.7,
  },
  carouselTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },

  // Indicator Styles
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
    borderRadius: 4,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  articleCard: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  articleContent: {
    flexDirection: 'row',
  },
  articleTextContainer: {
    flex: 2,
    paddingRight: 15,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleSource: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  articleDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 23,
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
  articleImageContainer: {
    flex: 1,
  },
  articleImage: {
    width: '100%',
    height: 85,
    borderRadius: 8,
  },
  bottomPadding: {
    height: 30,
  },

  // Detail Screen Styles - Updated for overlay
  detailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  detailHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.9)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 15,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  backButton: {
    padding: 5,
  },
  detailHeaderTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
  },
  shareButton: {
    padding: 5,
  },
  detailScrollView: {
    flex: 1,
  },
  detailImageContainer: {
    height: 350,
    overflow: 'hidden',
  },
  detailImage: {
    width: '100%',
    height: 400,
  },
  detailImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  floatingActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    paddingTop: 30,
    paddingHorizontal: 20,
    minHeight: height - 300,
  },
  detailMeta: {
    marginBottom: 20,
  },
  detailSourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailSource: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sourceDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  detailDate: {
    fontSize: 14,
  },
  detailAuthor: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 15,
  },
  detailDescription: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 25,
    fontWeight: '500',
  },
  articleBody: {
    marginBottom: 30,
  },
  bodyText: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 20,
  },
  readFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
  },
  readFullText: {
    fontSize: 16,
    fontWeight: '600',
  },
  readFullIcon: {
    marginLeft: 8,
  },
  tagsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
};

export default AppleScreenWrapper;