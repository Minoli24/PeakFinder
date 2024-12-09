import React from 'react';
import {View, StyleSheet, Image, FlatList} from 'react-native';
import ScrollViewWrapper from '../../components/wrappers/ScrollViewWrapper';
import SafeAreaWrapper from '../../components/wrappers/SafeAreaWrapper';
import ContentWrap from '../../components/wrappers/ContentWrap';
import NavigationHeader from '../../components/customComponents/headers/NavigationHeader';
import Carousel from 'react-native-reanimated-carousel';
import {Text} from '../../components/customComponents';
import {Icon, FAB} from 'react-native-paper';
import {colors} from '../../theme/colors';
import MountainCard from '../../components/customComponents/MountainCard';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';

const MountainDetails = ({route}: any) => {
  const {mountainData} = route.params;
  const navigation = useCustomNavigation();

  return (
    <ScrollViewWrapper isScrollable={false}>
      <SafeAreaWrapper>
        <ContentWrap paddingLeft={15} paddingRight={15} paddingTop={10}>
          <NavigationHeader title={`${mountainData.mountainName} Mountain`} />

          <View
            style={{
              marginTop: 30,
              height: 200,
            }}>
            <Carousel
              data={mountainData?.carouselImages}
              renderItem={({item}: {item: string}) => (
                <View style={styles.carouselItem}>
                  <Image source={{uri: item}} style={styles.carouselImage} />
                </View>
              )}
              width={350}
              height={190}
              loop //
              scrollAnimationDuration={1000}
              autoPlay={true}
              autoPlayInterval={3000}
            />
          </View>

          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text
              fontSize={13}
              style={{
                textAlign: 'center',
              }}>
              {mountainData.mountainDescription}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 21,
              alignItems: 'center',
            }}>
            <Text fontSize={18} variant="semiBold">
              Discover Paths
            </Text>
            <Icon source="tune" size={20} />
          </View>
          <FlatList
            data={mountainData?.paths}
            renderItem={({item}) => (
              <MountainCard
                onPress={() =>
                  navigation.navigate(routeNames.PathDetails, {
                    pathItem: item,
                    mountainData,
                  })
                }
                description={item.pathDescription}
                mountainName={item.pathName}
                showImage={false}
              />
            )}
          />
        </ContentWrap>
      </SafeAreaWrapper>

      <FAB
        color="white"
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate(routeNames.PathDetailsAdd, {
            mountainData,
          });

          console.log('FAB Pressed!');
        }}
      />
    </ScrollViewWrapper>
  );
};

export default MountainDetails;

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15, // Rounded corners for the carousel item
    overflow: 'hidden',
  },
  carouselImage: {
    width: 350,
    height: 190,
    borderRadius: 15, // Rounded corners for the image
    resizeMode: 'cover', // Ensures the image covers the area without distortion
  },
  fab: {
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primaryGreen, // Customize the background color of the FAB
  },
});
