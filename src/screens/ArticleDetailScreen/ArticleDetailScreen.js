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
  Share,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default class ArticleDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0)
    };
  }

  shareArticle = async () => {
    const { route } = this.props;
    const { article } = route.params;
    
    try {
      await Share.share({
        message: `${article.title}\n\n${article.url}`,
        url: article.url,
        title: article.title,
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

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { route } = this.props;
    const { article } = route.params;
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
          <TouchableOpacity style={styles.backButton} onPress={this.goBack}>
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
            <TouchableOpacity style={styles.floatingButton} onPress={this.goBack}>
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

const styles = {
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