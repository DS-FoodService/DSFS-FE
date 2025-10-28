const HomePage = ({ setPage }) => {
    const schoolFoodRef = useRef(null);
    const offCampusRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 가짜 데이터 (API 연동 필요)
    const schoolRestaurants = [
        { id: 'resto_1', name: '오늘의 메뉴', rating: 4.5, count: 100, image: 'https://placehold.co/300x300/F9E5C5/333?text=오늘의+메뉴', iconPlaceholder: '아이콘' },
        { id: 'resto_2', name: '비바쿡', rating: 4.2, count: 80, image: 'https://placehold.co/300x300/D4E9C1/333?text=비바쿡', iconPlaceholder: '아이콘' },
        { id: 'resto_3', name: '포한끼', rating: 4.0, count: 50, image: 'https://placehold.co/300x300/F5D7C0/333?text=포한끼', iconPlaceholder: '어양O L' },
    ];
    
    const offCampusRestaurants = [
        { id: 'resto_4', name: '양국', rating: 4.8, count: 100, image: 'https://placehold.co/300x300/F9E5C5/333?text=양국', price: '150' },
        { id: 'resto_5', name: '사리원', rating: 4.5, count: 80, image: 'https://placehold.co/300x300/D4E9C1/333?text=사리원', price: '250' },
        { id: 'resto_6', name: '엘수에뇨', rating: 4.3, count: 50, image: 'https://placehold.co/300x300/F5D7C0/333?text=엘수에뇨', price: '200' },
        { id: 'resto_7', name: '유부애', rating: 4.6, count: 120, image: 'https://placehold.co/300x300/F9E5C5/333?text=유부애', price: '150' },
        { id: 'resto_8', name: '산책', rating: 4.2, count: 50, image: 'https://placehold.co/300x300/D4E9C1/333?text=산책', price: '250' },
        { id: 'resto_9', name: '일락', rating: 4.7, count: 500, image: 'https://placehold.co/300x300/F5D7C0/333?text=일락', price: '450' },
    ];

    return (
        <div className="bg-gray-50">
            {/* --- 1. 히어로 섹션 --- */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">오늘 뭐 먹지?</h1>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button 
                            onClick={() => scrollToSection(schoolFoodRef)}
                            className="bg-lime-300 text-lime-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-lime-400 transition-colors shadow-lg"
                        >
                            학식당
                        </button>
                        <button 
                            onClick={() => scrollToSection(offCampusRef)}
                            className="bg-white border-2 border-lime-300 text-lime-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-lime-50 transition-colors shadow-lg"
                        >
                            학교 밖 식당
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img 
                        src="https://placehold.co/400x400/F3F4F6/9CA3AF?text=메인+음식+이미지" 
                        alt="다양한 음식"
                        className="rounded-full shadow-2xl"
                    />
                </div>
            </section>

            {/* --- 2. 이용방법 섹션 --- */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">📍</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Find the place!</h3>
                        <p className="text-gray-600">Promise To Deliver Within 30 Mins</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Select the icon</h3>
                        <p className="text-gray-600">Your Food Will Be Delivered 100% Fresh</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">📤</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Share</h3>
                        <p className="text-gray-600">Your Food Link Is Absolutely Free</p>
                    </div>
                </div>
            </section>

            {/* --- 3. 학식당 섹션 --- */}
            <section ref={schoolFoodRef} className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">학식당</h2>
                        <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-300">
                            See All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {schoolRestaurants.map(resto => (
                            <RestaurantCard key={resto.id} restaurant={resto} setPage={setPage} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4. 학교 밖 식당 섹션 --- */}
            <section ref={offCampusRef} className="py-16 bg-yellow-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">학교 밖 식당</h2>
                        <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-300">
                            See All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offCampusRestaurants.map(resto => (
                            <RestaurantCard key={resto.id} restaurant={resto} setPage={setPage} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- 5. 쿠폰/프로모션 섹션 --- */}
            <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-orange-100 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-lg">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                            <p className="text-orange-500 font-bold text-lg">Indian Special</p>
                            <h3 className="text-3xl font-bold text-gray-800 my-2">COUPON CODE</h3>
                            <p className="text-lg text-gray-700 mb-4">60% OFF</p>
                            <div className="bg-white border-2 border-dashed border-orange-300 px-6 py-2 rounded-lg inline-block">
                                <span className="text-xl font-bold text-orange-500">FOODDASH80</span>
                            </div>
                        </div>
                        <img 
                            src="https://placehold.co/150x150/F3F4F6/9CA3AF?text=쿠폰+이미지" 
                            alt="쿠폰"
                            className="rounded-full"
                        />
                    </div>
                    <div className="bg-orange-500 p-8 rounded-2xl text-white shadow-lg flex flex-col justify-center">
                        <p className="text-yellow-300 font-bold text-lg">SPECIAL OFFER</p>
                        <h3 className="text-3xl font-bold my-2">South Indian</h3>
                        <p className="mb-4">Get Best Food Anywhere And Win Exciting Vouchers</p>
                        <p className="text-lg font-bold">123-456-7890</p>
                    </div>
                </div>
            </section>
        </div>
    );
};