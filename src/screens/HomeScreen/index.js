import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../utils/CustomHeader';
import { useTheme } from '../../utils/ThemeContext';

const { width } = Dimensions.get('window');

// Wrapper component to use hooks
const HomeScreenWrapper = (props) => {
  const theme = useTheme();
  return <HomeScreen {...props} theme={theme} />;
};

class HomeScreen extends Component {
  state = {
    articles: [],
    isLoading: true,
    error: null,
    refreshing: false,
    activeCarouselIndex: 0,
  };

  getArticles = () => {
    axios
      .get(
        "https://newsapi.org/v2/top-headlines?country=us&apiKey=42f96ae7332147268cf9d2507b5681f2"
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
    this.props.navigation.navigate('ArticleDetail', { article });
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
          colors={colors.carouselGradient}
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
              <Text style={[styles.articleSource, { color: colors.accent }]}>
                {article.source}
              </Text>
              <Text style={[styles.articleDate, { color: colors.secondary }]}>
                {this.formatDate(article.date)}
              </Text>
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
    const { isLoading, articles, refreshing, error } = this.state;
    const { colors, isDarkMode, toggleTheme } = this.props.theme;

    if (error) {
      return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
          <CustomHeader 
            title="NewsHub" 
            subtitle="Stay updated with the latest"
            backgroundColor={colors.background}
            titleColor={colors.primary}
          />
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.primary }]}>
              Failed to load news
            </Text>
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <CustomHeader 
          title="NewsHub" 
          subtitle="Stay updated with the latest"
          backgroundColor={colors.background}
          titleColor={colors.primary}
          rightComponent={
            <TouchableOpacity style={styles.searchButton} onPress={toggleTheme}>
              <Ionicons 
                name={isDarkMode ? "sunny" : "moon"} 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          }
        />

        {isLoading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.loading }]}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.secondary }]}>
              Loading latest news...
            </Text>
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
                <Text style={[styles.carouselHeader, { color: colors.primary }]}>
                  Featured Stories
                </Text>
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
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                More Stories
              </Text>
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
  },
  searchButton: {
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
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
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
};

export default HomeScreenWrapper;