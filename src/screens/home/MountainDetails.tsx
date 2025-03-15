import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import ContainedButton from '../../components/customComponents/ContainedButton';

const MountainDetails = ({route}: any) => {
  const {mountainData} = route.params;
  const navigation = useCustomNavigation();
  const snapPoints = useMemo(() => ['40%'], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index == -1) {
      //   setBannerVisible(false);
    }
  }, []);

  const handlePresentModalPress = useCallback(() => {
    console.log('Presss');
    // setMarkerModalOpen(true);
    bottomSheetModalRef.current?.present();
  }, []);

  const [distance, setDistance] = useState(0);
  const [pathList, setPathList] = useState([]);
  const [shortestPaths, setShortestPaths] = useState([]);

  console.log('MMM', mountainData.paths);
  const filterPathsByDistance = () => {
    // Filter paths where distance is less than or equal to maxDistance
    const filteredPaths = mountainData.paths.filter(path => {
      const pathDistance = parseFloat(path.distance); // Convert distance to a number
      return !isNaN(pathDistance) && pathDistance <= distance; // Check if distance is less than or equal to maxDistance
    });
    setPathList(() => filteredPaths);
    bottomSheetModalRef.current?.close();

    // You can return or use the filteredPaths variable as needed
  };

  const findShortestPath = paths => {
    // Filter paths with numeric distances (ignoring "km (one way)" or similar text)
    const validPaths = paths.filter(path => !isNaN(parseFloat(path.distance)));

    // Find the shortest distance
    const shortestDistance = Math.min(
      ...validPaths.map(path => parseFloat(path.distance)),
    );

    // Filter all paths that have the shortest distance
    const shortestPaths = validPaths.filter(
      path => parseFloat(path.distance) === shortestDistance,
    );

    // Return an array of pathIds with the shortest distance
    return shortestPaths.map(path => path.pathId);
  };

  useEffect(() => {
    if (mountainData?.paths) {
      console.log('Shortest', findShortestPath(mountainData.paths));
      setShortestPaths(findShortestPath(mountainData.paths));
      setPathList(mountainData?.paths);
    }
  }, [mountainData]);

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
            <TouchableOpacity onPress={handlePresentModalPress}>
              <Icon source="tune" size={20} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={pathList}
            renderItem={({item}) => (
              <MountainCard
                pathId={item.pathId}
                shortestPaths={shortestPaths}
                isPath={true}
                hasAnimals={item?.hasAnimals && item.hasAnimals == 'Yes'}
                hasWater={item.hasWater && item.hasWater == 'Yes'}
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                // textAlign: 'center',
                fontWeight: '800',
              }}>
              Trail Distance
            </Text>
            <Text
              style={{
                // textAlign: 'center',
                fontWeight: '800',
              }}>
              {distance} KM
            </Text>
          </View>

          <View>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={1}
              maximumValue={10}
              minimumTrackTintColor={colors.primaryGreen}
              maximumTrackTintColor="#000000"
              onValueChange={val => setDistance(Math.round(val))}
              thumbTintColor={colors.primaryGreen}
              value={distance}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  // textAlign: 'center',
                  fontWeight: '800',
                }}>
                0 KM
              </Text>
              <Text
                style={{
                  // textAlign: 'center',
                  fontWeight: '800',
                }}>
                10 KM
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <ContainedButton label="Filter" onPress={filterPathsByDistance} />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
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
  contentContainer: {
    flex: 1,
    padding: 10,
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
