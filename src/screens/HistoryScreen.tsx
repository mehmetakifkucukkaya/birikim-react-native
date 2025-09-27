import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Avatar,
    Card,
    Chip,
    Icon,
    Text,
    useTheme
} from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { FirestoreService, History } from '../services/firestoreService';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const [historyList, setHistoryList] = useState<History[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<History['action'] | 'all'>('all');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await FirestoreService.getAllHistory();
            setHistoryList(data);
        } catch (error) {
            console.error('History yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const filterHistory = (history: History[]) => {
        if (filter === 'all') return history;
        return history.filter(item => item.action === filter);
    };

    const getActionIcon = (action: History['action']) => {
        const iconMap = {
            'eklendi': { name: 'add-circle', color: '#10B981' },
            'güncellendi': { name: 'edit', color: '#F59E0B' },
            'silindi': { name: 'remove-circle', color: '#EF4444' }
        };
        return iconMap[action];
    };

    const getActionText = (action: History['action']) => {
        const textMap = {
            'eklendi': 'Eklendi',
            'güncellendi': 'Güncellendi',
            'silindi': 'Silindi'
        };
        return textMap[action];
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

        if (diffInHours < 24) {
            return new Intl.DateTimeFormat('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(date) + ' - Bugün';
        } else if (diffInHours < 48) {
            return 'Dün';
        } else if (diffInHours < 72) {
            return '2 gün önce';
        } else if (diffInHours < 96) {
            return '3 gün önce';
        } else if (diffInHours < 168) { // 7 days
            return Math.floor(diffInHours / 24) + ' gün önce';
        } else {
            return new Intl.DateTimeFormat('tr-TR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const getHistoryValue = (item: History) => {
        if (item.action === 'eklendi' && item.newData) {
            const value = item.newData.buyPrice! * item.newData.quantity!;
            return formatCurrency(value);
        } else if (item.action === 'silindi' && item.oldData) {
            const value = item.oldData.buyPrice! * item.oldData.quantity!;
            return formatCurrency(value);
        } else if (item.action === 'güncellendi') {
            // Calculate profit/loss for update
            if (item.details.includes('hesaplama')) {
                // This is a profit/loss calculation
                const profitMatch = item.details.match(/([+-]?\d+\.?\d*)/);
                if (profitMatch) {
                    const profit = parseFloat(profitMatch[1]);
                    return profit >= 0 ? `+${formatCurrency(profit)}` : formatCurrency(profit);
                }
            }
            return '€1.08'; // Placeholder for price updates
        }
        return '';
    };

    const renderHistoryItem = ({ item }: { item: History }) => {
        const icon = getActionIcon(item.action);
        const value = getHistoryValue(item);
        const isProfit = item.action === 'güncellendi' && value.includes('+');
        const isLoss = item.action === 'güncellendi' && value.includes('-') && !value.includes('+');

        return (
            <Card containerStyle={[styles.historyCard, { backgroundColor: '#0F141B' }]}>
                <View style={styles.historyHeader}>
                    <View style={styles.historyInfo}>
                        <Avatar
                            rounded
                            icon={{
                                name: icon.name,
                                type: 'material',
                                color: 'white'
                            }}
                            containerStyle={{ backgroundColor: icon.color }}
                            size={36}
                        />
                        <View style={styles.historyDetails}>
                            <Text style={[styles.historyTitle, { color: '#E6EEF6' }]}>
                                {getActionText(item.action)} {item.newData?.type || item.oldData?.type || 'Investment'}
                            </Text>
                            <Text style={[styles.historyDescription, { color: '#B7C2CC' }]}>
                                {item.details}
                            </Text>
                            <Text style={[styles.historyDate, { color: '#6B7785' }]}>
                                {formatDate(item.date)}
                            </Text>
                        </View>
                    </View>

                    {value && (
                        <View style={styles.historyValue}>
                            <Text style={[
                                styles.valueText,
                                {
                                    color: isProfit ? '#22C55E' :
                                        isLoss ? '#EF4444' :
                                            '#E6EEF6'
                                }
                            ]}>
                                {value}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Additional details for updates */}
                {item.action === 'güncellendi' && item.oldData && item.newData && (
                    <View style={styles.updateDetails}>
                        <View style={styles.updateRow}>
                            <Text style={[styles.updateLabel, { color: '#B7C2CC' }]}>
                                Önce:
                            </Text>
                            <Text style={[styles.updateValue, { color: '#6B7785' }]}>
                                {item.oldData.quantity} × {formatCurrency(item.oldData.buyPrice || 0)}
                            </Text>
                        </View>
                        <Icon
                            name="arrow-downward"
                            type="material"
                            color="#6B7785"
                            size={16}
                        />
                        <View style={styles.updateRow}>
                            <Text style={[styles.updateLabel, { color: '#B7C2CC' }]}>
                                Sonra:
                            </Text>
                            <Text style={[styles.updateValue, { color: '#E6EEF6' }]}>
                                {item.newData.quantity} × {formatCurrency(item.newData.buyPrice || 0)}
                            </Text>
                        </View>
                    </View>
                )}
            </Card>
        );
    };

    const filteredHistory = filterHistory(historyList);

    return (
        <View style={[styles.container, { backgroundColor: '#0B0F14' }]}>
            {/* Header */}
            <AppHeader
                title="Geçmiş"
            />

            {/* Filter Chips - Premium Fintech Style */}
            <View style={styles.filterContainer}>
                <Chip
                    title="Tümü"
                    onPress={() => setFilter('all')}
                    type={filter === 'all' ? 'solid' : 'outline'}
                    buttonStyle={filter === 'all'
                        ? { backgroundColor: '#22C55E', borderColor: '#22C55E' }
                        : {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 255, 0.06)',
                            borderWidth: 1
                        }
                    }
                    titleStyle={filter === 'all'
                        ? { color: 'white', fontWeight: '600' }
                        : { color: '#B7C2CC', fontWeight: '500' }
                    }
                    containerStyle={styles.filterChip}
                />
                <Chip
                    title="Eklenen"
                    onPress={() => setFilter('eklendi')}
                    type={filter === 'eklendi' ? 'solid' : 'outline'}
                    buttonStyle={filter === 'eklendi'
                        ? { backgroundColor: '#22C55E', borderColor: '#22C55E' }
                        : {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 255, 0.06)',
                            borderWidth: 1
                        }
                    }
                    titleStyle={filter === 'eklendi'
                        ? { color: 'white', fontWeight: '600' }
                        : { color: '#B7C2CC', fontWeight: '500' }
                    }
                    containerStyle={styles.filterChip}
                />
                <Chip
                    title="Güncellenen"
                    onPress={() => setFilter('güncellendi')}
                    type={filter === 'güncellendi' ? 'solid' : 'outline'}
                    buttonStyle={filter === 'güncellendi'
                        ? { backgroundColor: '#06B6D4', borderColor: '#06B6D4' }
                        : {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 255, 0.06)',
                            borderWidth: 1
                        }
                    }
                    titleStyle={filter === 'güncellendi'
                        ? { color: 'white', fontWeight: '600' }
                        : { color: '#B7C2CC', fontWeight: '500' }
                    }
                    containerStyle={styles.filterChip}
                />
                <Chip
                    title="Silinen"
                    onPress={() => setFilter('silindi')}
                    type={filter === 'silindi' ? 'solid' : 'outline'}
                    buttonStyle={filter === 'silindi'
                        ? { backgroundColor: '#EF4444', borderColor: '#EF4444' }
                        : {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 255, 0.06)',
                            borderWidth: 1
                        }
                    }
                    titleStyle={filter === 'silindi'
                        ? { color: 'white', fontWeight: '600' }
                        : { color: '#B7C2CC', fontWeight: '500' }
                    }
                    containerStyle={styles.filterChip}
                />
            </View>

            {/* History List */}
            {filteredHistory.length === 0 ? (
                <View style={styles.emptyState}>
                    <Icon
                        name="history"
                        type="material"
                        color="#B7C2CC"
                        size={64}
                    />
                    <Text style={[styles.emptyStateText, { color: '#B7C2CC' }]}>
                        {filter === 'all' ? 'Henüz işlem geçmişi yok' : `${getActionText(filter as History['action'])} işlem bulunamadı`}
                    </Text>
                    <Text style={[styles.emptyStateSubtext, { color: '#6B7785' }]}>
                        Yatırım işlemleriniz gerçekleştikçe burada görünecek
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredHistory}
                    renderItem={renderHistoryItem}
                    keyExtractor={(item) => item.id!}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#6366F1']}
                            tintColor="#6366F1"
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    filterChip: {
        marginRight: 8,
        marginBottom: 8,
    },
    historyCard: {
        borderRadius: 16,                           // Modern radius
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,                             // Border-first design
        borderColor: 'rgba(255, 255, 255, 0.06)',  // Subtle border
        elevation: 0,                               // No shadow
        shadowColor: 'transparent',                 // No shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    historyInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    historyDetails: {
        marginLeft: 12,
        flex: 1,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    historyDescription: {
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 18,
    },
    historyDate: {
        fontSize: 12,
    },
    historyValue: {
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    updateDetails: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.06)',  // Premium fintech border
        alignItems: 'center',
    },
    updateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    updateLabel: {
        fontSize: 12,
        marginRight: 8,
        minWidth: 40,
    },
    updateValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default HistoryScreen;


