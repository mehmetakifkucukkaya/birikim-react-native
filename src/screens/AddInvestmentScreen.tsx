import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Button,
    Icon,
    Input,
    ListItem,
    Overlay,
    Text,
    useTheme
} from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { FirestoreService, Investment } from '../services/firestoreService';

type Props = NativeStackScreenProps<RootStackParamList, 'AddInvestment'>;

const AddInvestmentScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const formOpacity = useRef(new Animated.Value(0)).current;
    const formSlide = useRef(new Animated.Value(50)).current;
    const buttonScale = useRef(new Animated.Value(0.9)).current;

    // Animation sequence
    useEffect(() => {
        Animated.sequence([
            // First fade in the header
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad)
            }),
            // Then slide in the form
            Animated.parallel([
                Animated.timing(formOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(formSlide, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.back(1.5))
                }),
                Animated.spring(buttonScale, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true
                })
            ])
        ]).start();
    }, []);

    // Form fields
    const [selectedType, setSelectedType] = useState<Investment['type'] | ''>('');
    const [buyPrice, setBuyPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [buyDate, setBuyDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    // UI states
    const [showTypePicker, setShowTypePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const investmentTypes: Investment['type'][] = ['Altın', 'USD', 'Euro', 'Gümüş', 'BIST100', 'Diğer'];

    const validateForm = (): boolean => {
        if (!selectedType) {
            Alert.alert('Hata', 'Yatırım türü seçmelisiniz.');
            return false;
        }

        if (!buyPrice || parseFloat(buyPrice) <= 0) {
            Alert.alert('Hata', 'Geçerli bir alış fiyatı giriniz.');
            return false;
        }

        if (!quantity || parseFloat(quantity) <= 0) {
            Alert.alert('Hata', 'Geçerli bir miktar giriniz.');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'> = {
                type: selectedType as Investment['type'],
                buyPrice: parseFloat(buyPrice),
                quantity: parseFloat(quantity),
                buyDate: buyDate,
                notes: notes.trim() || undefined
            };

            await FirestoreService.addInvestment(investment);

            Alert.alert(
                'Başarılı',
                'Yatırım başarıyla eklendi!',
                [
                    {
                        text: 'Tamam',
                        onPress: () => { } // Navigation handled by bottom tab
                    }
                ]
            );
        } catch (error) {
            console.error('Yatırım eklenirken hata:', error);
            Alert.alert('Hata', 'Yatırım eklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/[^0-9.,]/g, '');
        return numericValue;
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const getTypeIcon = (type: Investment['type']) => {
        const iconMap: Record<Investment['type'], { name: string; color: string }> = {
            'Altın': { name: 'local-offer', color: '#FFD700' },
            'USD': { name: 'attach-money', color: '#4CAF50' },
            'Euro': { name: 'euro-symbol', color: '#2196F3' },
            'Gümüş': { name: 'star', color: '#9E9E9E' },
            'BIST100': { name: 'trending-up', color: '#FF9800' },
            'Diğer': { name: 'account-balance', color: '#9C27B0' }
        };

        return iconMap[type];
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setBuyDate(selectedDate);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.white }]}>
            {/* Modern Header with Gradient */}
            <AppHeader
                title="Yeni Yatırım Ekle"
                showBackButton={true}
                fadeAnim={fadeAnim}
                onBackPress={() => navigation.goBack()}
            />

            {/* Modern Form with Animation */}
            <Animated.View
                style={[
                    styles.form,
                    {
                        opacity: formOpacity,
                        transform: [{ translateY: formSlide }]
                    }
                ]}
            >
                {/* Asset Type Picker */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.black }]}>
                        Varlık Türü
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.pickerButton,
                            {
                                backgroundColor: theme.colors.grey0,
                                borderColor: selectedType ? '#2196F3' : theme.colors.grey4
                            }
                        ]}
                        onPress={() => setShowTypePicker(true)}
                    >
                        <View style={styles.pickerContent}>
                            {selectedType ? (
                                <>
                                    <Icon
                                        name={getTypeIcon(selectedType).name}
                                        type="material"
                                        color={getTypeIcon(selectedType).color}
                                        size={20}
                                    />
                                    <Text style={[styles.pickerText, { color: theme.colors.black }]}>
                                        {selectedType}
                                    </Text>
                                </>
                            ) : (
                                <Text style={[styles.pickerPlaceholder, { color: theme.colors.grey3 }]}>
                                    Varlık türü seçin
                                </Text>
                            )}
                        </View>
                        <Icon
                            name="keyboard-arrow-down"
                            type="material"
                            color={theme.colors.grey3}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>

                {/* Purchase Price */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.black }]}>
                        Alış Fiyatı
                    </Text>
                    <Input
                        placeholder="0.00"
                        value={buyPrice}
                        onChangeText={(text) => setBuyPrice(formatCurrency(text))}
                        keyboardType="decimal-pad"
                        rightIcon={{
                            name: 'attach-money',
                            type: 'material',
                            color: theme.colors.grey3
                        }}
                        inputContainerStyle={[
                            styles.inputContainer,
                            { borderColor: buyPrice ? '#2196F3' : theme.colors.grey4 }
                        ]}
                        inputStyle={[styles.inputText, { color: theme.colors.black }]}
                        placeholderTextColor={theme.colors.grey3}
                        containerStyle={styles.inputWrapper}
                    />
                </View>

                {/* Quantity */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.black }]}>
                        Miktar
                    </Text>
                    <Input
                        placeholder={selectedType === 'Altın' || selectedType === 'Gümüş' ? 'örn., 10' :
                            selectedType === 'USD' || selectedType === 'Euro' ? 'örn., 100' : 'örn., 10'}
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="decimal-pad"
                        rightIcon={{
                            name: selectedType === 'Altın' || selectedType === 'Gümüş' ? 'scale' :
                                selectedType === 'USD' || selectedType === 'Euro' ? 'money' : 'bar-chart',
                            type: 'material',
                            color: theme.colors.grey3
                        }}
                        inputContainerStyle={[
                            styles.inputContainer,
                            { borderColor: quantity ? '#2196F3' : theme.colors.grey4 }
                        ]}
                        inputStyle={[styles.inputText, { color: theme.colors.black }]}
                        placeholderTextColor={theme.colors.grey3}
                        containerStyle={styles.inputWrapper}
                    />
                </View>

                {/* Date Picker */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.black }]}>
                        Tarih
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.dateButton,
                            {
                                backgroundColor: theme.colors.grey0,
                                borderColor: theme.colors.grey4
                            }
                        ]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Icon
                            name="calendar-today"
                            type="material"
                            color="#2196F3"
                            size={20}
                        />
                        <Text style={[styles.dateText, { color: theme.colors.black }]}>
                            {formatDate(buyDate)}
                        </Text>
                        <Icon
                            name="keyboard-arrow-down"
                            type="material"
                            color={theme.colors.grey3}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>

                {/* Notes */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.black }]}>
                        Notlar (İsteğe Bağlı)
                    </Text>
                    <Input
                        placeholder="Bu yatırım hakkında notlar ekleyin..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                        inputContainerStyle={[
                            styles.inputContainer,
                            styles.textAreaContainer,
                            { borderColor: notes ? '#2196F3' : theme.colors.grey4 }
                        ]}
                        inputStyle={[styles.inputText, styles.textAreaInput, { color: theme.colors.black }]}
                        placeholderTextColor={theme.colors.grey3}
                        containerStyle={styles.inputWrapper}
                    />
                </View>

                {/* Modern Submit Button with Gradient */}
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.submitButtonGradient,
                            {
                                opacity: (!selectedType || !buyPrice || !quantity) ? 0.5 : 1
                            }
                        ]}
                    >
                        <Button
                            title={loading ? "Kaydediliyor..." : "Yatırım Ekle"}
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={loading || !selectedType || !buyPrice || !quantity}
                            buttonStyle={styles.submitButton}
                            titleStyle={styles.submitButtonText}
                            icon={{
                                name: 'check-circle',
                                type: 'material',
                                size: 24,
                                color: 'white',
                            }}
                            disabledStyle={{ backgroundColor: 'transparent' }}
                            disabledTitleStyle={{ color: 'white' }}
                        />
                    </LinearGradient>
                </Animated.View>
            </Animated.View>

            {/* Asset Type Picker Overlay */}
            <Overlay
                isVisible={showTypePicker}
                onBackdropPress={() => setShowTypePicker(false)}
                overlayStyle={styles.overlay}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                animationType="fade"
            >
                <View style={styles.overlayHeader}>
                    <Text style={styles.overlayTitle}>
                        Varlık Türü Seçin
                    </Text>
                    <TouchableOpacity
                        style={styles.overlayCloseButton}
                        onPress={() => setShowTypePicker(false)}
                    >
                        <Icon
                            name="close"
                            type="material"
                            color="white"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
                {investmentTypes.map((type) => (
                    <ListItem
                        key={type}
                        onPress={() => {
                            setSelectedType(type);
                            setShowTypePicker(false);
                        }}
                        containerStyle={[
                            styles.listItem,
                            selectedType === type && styles.selectedListItem
                        ]}
                        Component={TouchableOpacity}
                    >
                        <View style={[styles.typeIconContainer, { backgroundColor: getTypeIcon(type).color + '30' }]}>
                            <Icon
                                name={getTypeIcon(type).name}
                                type="material"
                                color={getTypeIcon(type).color}
                                size={24}
                            />
                        </View>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listItemTitle}>
                                {type}
                            </ListItem.Title>
                        </ListItem.Content>
                        {selectedType === type && (
                            <View style={styles.checkIconContainer}>
                                <Icon
                                    name="check"
                                    type="material"
                                    color="#FFFFFF"
                                    size={16}
                                />
                            </View>
                        )}
                    </ListItem>
                ))}
            </Overlay>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={buyDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: -0.5,
    },
    form: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    fieldContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        color: '#FFFFFF',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        minHeight: 60,
        backgroundColor: '#1C1C1E',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    pickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    pickerText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    pickerPlaceholder: {
        fontSize: 16,
        color: '#8E8E93',
    },
    inputWrapper: {
        paddingHorizontal: 0,
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 60,
        backgroundColor: '#1C1C1E',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    inputText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    textAreaContainer: {
        minHeight: 120,
        alignItems: 'flex-start',
    },
    textAreaInput: {
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        minHeight: 60,
        backgroundColor: '#1C1C1E',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    dateText: {
        fontSize: 16,
        marginLeft: 12,
        flex: 1,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    submitButtonGradient: {
        borderRadius: 16,
        marginTop: 40,
        marginBottom: 30,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#10B981',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitButton: {
        paddingVertical: 16,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 0.5,
    },
    overlay: {
        borderRadius: 24,
        padding: 24,
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    overlayCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    listItemTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    selectedListItem: {
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderLeftWidth: 3,
        borderLeftColor: '#6366F1',
    },
    checkIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    overlayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    listItem: {
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
});

export default AddInvestmentScreen;


