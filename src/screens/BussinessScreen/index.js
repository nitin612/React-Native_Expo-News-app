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

const { width, height } = Dimensions.get('window');

// Article Detail Screen Component
class ArticleDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0)
    };
  }

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
    const { article, onBack } = this.props;
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
      <View style={styles.detailContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Animated Header */}
        <Animated.View style={[styles.detailHeader, { opacity: headerOpacity }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
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
            <TouchableOpacity style={styles.floatingButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButton} onPress={this.shareArticle}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Article Content */}
          <View style={styles.detailContent}>
            <View style={styles.detailMeta}>
              <View style={styles.detailSourceContainer}>
                <Text style={styles.detailSource}>{article.source}</Text>
                <View style={styles.sourceDivider} />
                <Text style={styles.detailDate}>
                  {this.formatFullDate(article.date)}
                </Text>
              </View>
              {article.author && (
                <Text style={styles.detailAuthor}>By {article.author}</Text>
              )}
            </View>

            <Text style={styles.detailTitle}>{article.title}</Text>
            
            {article.description && (
              <Text style={styles.detailDescription}>{article.description}</Text>
            )}

            {/* Simulated Article Content */}
            <View style={styles.articleBody}>
              <Text style={styles.bodyText}>
                {article.description || "This is where the full article content would appear. In a real implementation, you would fetch the complete article content from your news API or use a web scraping service to extract the full text."}
              </Text>
              
              <Text style={styles.bodyText}>
                The cryptocurrency market continues to evolve rapidly, with new developments and trends emerging daily. Stay informed about the latest changes that could impact your investments and understanding of this dynamic space.
              </Text>

              <Text style={styles.bodyText}>
                Market analysis shows various factors influencing price movements, from regulatory changes to technological advancements and institutional adoption patterns.
              </Text>

              {/* Read Full Article Button */}
              <TouchableOpacity 
                style={styles.readFullButton}
                onPress={() => Linking.openURL(article.url)}
              >
                <Text style={styles.readFullText}>Read Full Article</Text>
                <Ionicons name="open-outline" size={18} color="#007AFF" style={styles.readFullIcon} />
              </TouchableOpacity>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Related Topics</Text>
              <View style={styles.tags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Cryptocurrency</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Blockchain</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Finance</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    );
  }
}

// Main Home Screen Component
export default class HomeScreen extends Component {
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
        "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=42f96ae7332147268cf9d2507b5681f2"
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
    this.setState({ selectedArticle: article, showDetail: true });
  };

  closeArticle = () => {
    this.setState({ showDetail: false, selectedArticle: null });
  };

  renderCarouselItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.carouselCard}
        onPress={() => this.openArticle(item)}
        activeOpacity={0.95}
      >
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
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
    const featuredArticles = this.state.articles.slice(0, 5);
    
    return (
      <View style={styles.indicatorContainer}>
        {featuredArticles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === this.state.activeCarouselIndex ? styles.activeIndicator : {}
            ]}
          />
        ))}
      </View>
    );
  };

  renderRegularArticle = (article, index) => {
    return (
      <TouchableOpacity
        key={article.url + '_' + index}
        style={styles.articleCard}
        onPress={() => this.openArticle(article)}
        activeOpacity={0.7}
      >
        <View style={styles.articleContent}>
          <View style={styles.articleTextContainer}>
            <View style={styles.articleMeta}>
              <Text style={styles.articleSource}>{article.source}</Text>
              <Text style={styles.articleDate}>{this.formatDate(article.date)}</Text>
            </View>
            <Text style={styles.articleTitle} numberOfLines={3}>
              {article.title}
            </Text>
            <Text style={styles.articleDescription} numberOfLines={2}>
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

    if (showDetail && selectedArticle) {
      return (
        <ArticleDetailScreen
          article={selectedArticle}
          onBack={this.closeArticle}
        />
      );
    }

    if (error) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
            <Text style={styles.errorText}>Failed to load news</Text>
            <TouchableOpacity style={styles.retryButton} onPress={this.getArticles}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const featuredArticles = articles.slice(0, 5);
    const regularArticles = articles.slice(5);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Crypto News</Text>
          <Text style={styles.headerSubtitle}>Stay updated with the latest</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading latest news...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                tintColor="#007AFF"
              />
            }
          >
            {featuredArticles.length > 0 && (
              <>
                <Text style={styles.carouselHeader}>Featured Stories</Text>
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
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>More Stories</Text>
            </View>
            
            {regularArticles.map((article, index) => 
              this.renderRegularArticle(article, index)
            )}
            
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#8e8e93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#1c1c1e',
    marginTop: 15,
    marginBottom: 25,
  },
  retryButton: {
    backgroundColor: '#007AFF',
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
    color: '#1c1c1e',
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
    backgroundColor: '#d1d1d6',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 24,
    borderRadius: 4,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  articleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
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
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  articleDate: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 8,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    lineHeight: 23,
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 15,
    color: '#636366',
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

  // Detail Screen Styles
  detailContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
    color: '#007AFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sourceDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8e8e93',
    marginHorizontal: 8,
  },
  detailDate: {
    fontSize: 14,
    color: '#8e8e93',
  },
  detailAuthor: {
    fontSize: 15,
    color: '#636366',
    fontStyle: 'italic',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1c1e',
    lineHeight: 36,
    marginBottom: 15,
  },
  detailDescription: {
    fontSize: 18,
    color: '#636366',
    lineHeight: 26,
    marginBottom: 25,
    fontWeight: '500',
  },
  articleBody: {
    marginBottom: 30,
  },
  bodyText: {
    fontSize: 17,
    color: '#1c1c1e',
    lineHeight: 26,
    marginBottom: 20,
  },
  readFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f7',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  readFullText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  readFullIcon: {
    marginLeft: 8,
  },
  tagsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f7',
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#007AFF',
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