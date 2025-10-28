import React, { useMemo } from "react";
import type { TokenPrice } from "../type/token";
import { useFetch } from "../hooks/useFetch";
import TokenIcon from "./icon/TokenIcon";

interface PopularMarket {
    from: string;
    to: string;
    rate?: number;
}

interface SampleConvertProps {
    onMarketSelect: (from: string, to: string) => void;
}

const SampleConvert: React.FC<SampleConvertProps> = ({ onMarketSelect }) => {
    const { data: tokens } = useFetch<TokenPrice[]>(
        "https://interview.switcheo.com/prices.json"
    );

    // Lấy ngẫu nhiên 24 token (loại bỏ USD) và tính tỷ giá
    const popularMarkets = useMemo((): PopularMarket[] => {
        if (!tokens || tokens.length < 2) return [];

        // Lọc token có currency và price
        const availableTokens = tokens.filter(t => t.currency && t.price);

        if (availableTokens.length < 2) return [];

        const markets: PopularMarket[] = [];

        // Giới hạn số lượng cặp muốn tạo
        const pairCount = Math.min(20, availableTokens.length); // ví dụ 10 cặp

        for (let i = 0; i < pairCount; i++) {
            // Chọn 2 token khác nhau
            let fromIndex = Math.floor(Math.random() * availableTokens.length);
            let toIndex = Math.floor(Math.random() * availableTokens.length);

            // đảm bảo from ≠ to
            while (toIndex === fromIndex) {
                toIndex = Math.floor(Math.random() * availableTokens.length);
            }

            const fromToken = availableTokens[fromIndex];
            const toToken = availableTokens[toIndex];

            markets.push({
                from: fromToken.currency,
                to: toToken.currency,
                rate: fromToken.price / toToken.price
            });
        }

        return markets;
    }, [tokens]);


    // Nhóm thành 4 cột, mỗi cột 6 items
    const groupedMarkets = useMemo(() => {
        const groups = [[], [], [], []] as PopularMarket[][];
        popularMarkets.forEach((market, index) => {
            groups[index % 4].push(market);
        });
        return groups;
    }, [popularMarkets]);

    if (!tokens || popularMarkets.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Quick Convert
                </h2>
            </div>

            <div className="grid grid-cols-4 gap-8">
                {groupedMarkets.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-3">
                        {column.map((market, index) => (
                            <button
                                key={`${market.from}-${index}`}
                                onClick={() => onMarketSelect(market.from, market.to)}
                                className="w-full text-left p-5 rounded-2xl border border-gray-200/80 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group bg-white/80 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center -space-x-2">
                                            <div className="p-1 bg-white rounded-full shadow-sm border border-gray-100 transform group-hover:scale-110 transition-transform duration-300">
                                                <TokenIcon token={market.from} />
                                            </div>
                                            <div className="p-1 bg-white rounded-full shadow-sm border border-gray-100 transform group-hover:scale-110 transition-transform duration-300 delay-75">
                                                <TokenIcon token={market.to} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                                {/* Thêm thông tin tỷ giá hoặc volume nếu có */}
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SampleConvert;