/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const core_1 = __webpack_require__(2);
const cache_manager_1 = __webpack_require__(13);
const config_1 = __webpack_require__(10);
const notification_module_1 = __webpack_require__(23);
const axios_1 = __webpack_require__(22);
const notion_module_1 = __webpack_require__(26);
const app_scheduler_1 = __webpack_require__(28);
const schedule_1 = __webpack_require__(29);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
            }),
            axios_1.HttpModule.register({
                global: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            notification_module_1.NotificationModule,
            notion_module_1.NotionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            app_scheduler_1.AppScheduler,
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    transform: true,
                }),
            },
            {
                provide: cache_manager_1.Cache,
                useExisting: cache_manager_1.CACHE_MANAGER,
            },
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var AppController_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
let AppController = AppController_1 = class AppController {
    constructor(appService) {
        this.appService = appService;
        this.logger = new common_1.Logger(AppController_1.name);
    }
    notifyTask() {
        this.logger.log('Attempting to notify!');
        return this.appService.notifyTask();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)('notify'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "notifyTask", null);
exports.AppController = AppController = AppController_1 = tslib_1.__decorate([
    (0, common_1.Controller)('task'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var AppService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const notion_service_1 = __webpack_require__(7);
const notification_service_1 = __webpack_require__(16);
let AppService = AppService_1 = class AppService {
    constructor(notionService, notificationService) {
        this.notionService = notionService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AppService_1.name);
    }
    async notifyTask() {
        const item = await this.notionService.getNextPage();
        if (!item) {
            return {
                success: false,
            };
        }
        this.logger.log(`Sending notification for ${item.title}`);
        this.notificationService.sendNotification({
            message: `Nueva tarea pendiente que termina en: hora`,
            title: item.title,
            url: item.url,
            urlTitle: 'Ver en Notion',
            ttl: 60 * 60 * 12,
        });
        return {
            success: true,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notion_service_1.NotionService !== "undefined" && notion_service_1.NotionService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], AppService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotionService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const constants_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
const config_1 = __webpack_require__(10);
const rxjs_1 = __webpack_require__(11);
const notion_repository_1 = __webpack_require__(12);
const notion_dto_1 = __webpack_require__(15);
let NotionService = class NotionService {
    constructor(notionClient, config, notionRepository) {
        this.notionClient = notionClient;
        this.config = config;
        this.notionRepository = notionRepository;
        this.logger = new common_1.Logger('NotionService');
    }
    onModuleInit() {
        this.getDatabaseItems().subscribe({});
    }
    getDatabaseItems() {
        return (0, rxjs_1.from)(this.notionClient.databases.query({
            database_id: this.config.get('DATABASE_ID'),
        })).pipe((0, rxjs_1.catchError)((err) => {
            this.logger.error(`Failed to retrieve database from notion`);
            this.logger.error(err.status);
            this.logger.error(err.message);
            throw new common_1.HttpException(err.message, err.status);
        }), (0, rxjs_1.switchMap)((res) => (0, rxjs_1.from)(res.results)), (0, rxjs_1.map)((page) => new notion_dto_1.Page({
            id: page.id,
            title: page.properties['Habits']['title'][0].plain_text,
            startDate: page.properties['Start Date']['date'].start,
            endDate: page.properties['End Date']['date'].start,
            done: page.properties['Done']['checkbox'],
            url: page.url,
        })), (0, rxjs_1.toArray)(), (0, rxjs_1.map)((items) => items.sort((a, b) => a.startDate.localeCompare(b.startDate))), (0, rxjs_1.tap)((items) => this.notionRepository.setPages(items)));
    }
    getNextPage() {
        return this.notionRepository.getNextItem();
    }
};
exports.NotionService = NotionService;
exports.NotionService = NotionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.NOTION_CLIENT)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.Client !== "undefined" && client_1.Client) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof notion_repository_1.NotionRepository !== "undefined" && notion_repository_1.NotionRepository) === "function" ? _c : Object])
], NotionService);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NOTION_CLIENT = void 0;
exports.NOTION_CLIENT = 'NOTION_CLIENT';


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@notionhq/client");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotionRepository = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const cache_manager_1 = __webpack_require__(13);
const luxon_1 = __webpack_require__(14);
let NotionRepository = class NotionRepository {
    constructor(cache) {
        this.cache = cache;
    }
    async setPages(data) {
        await this.cache.set('pages', data);
    }
    async getPages() {
        const pages = await this.cache.get('pages');
        return !pages?.length ? [] : pages;
    }
    async getNextItem() {
        const pages = await this.getPages();
        if (!pages?.length) {
            return;
        }
        const now = luxon_1.DateTime.local({ zone: 'America/Bogota' }).set({
            second: 0,
            millisecond: 0,
        });
        return pages.find((page) => {
            const startDate = luxon_1.DateTime.fromISO(page.startDate);
            const minus = startDate.minute - 0;
            const dateMinusFive = startDate.set({
                minute: minus,
                second: 0,
                millisecond: 0,
            });
            return now.toISO() === dateMinusFive.toISO();
        });
    }
};
exports.NotionRepository = NotionRepository;
exports.NotionRepository = NotionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof cache_manager_1.Cache !== "undefined" && cache_manager_1.Cache) === "function" ? _a : Object])
], NotionRepository);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/cache-manager");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("luxon");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Page = exports.Notification = void 0;
class Notification {
}
exports.Notification = Notification;
class Page {
    constructor(input) {
        Object.assign(this, input);
    }
}
exports.Page = Page;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const constants_1 = __webpack_require__(17);
const strategies_1 = __webpack_require__(18);
let NotificationService = class NotificationService {
    constructor(strategies) {
        this.strategies = strategies;
    }
    sendNotification(payload) {
        // By default, use pushover, maybe can be an env var
        const strategy = this.strategies.get(strategies_1.NotificationTypes.PUSHOVER);
        strategy.notify(payload);
    }
    getData() {
        return {
            message: 'Hello API',
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.NOTIFICATION_STRATEGIES)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof strategies_1.NotificationStrategies !== "undefined" && strategies_1.NotificationStrategies) === "function" ? _a : Object])
], NotificationService);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NOTIFICATION_STRATEGIES = void 0;
exports.NOTIFICATION_STRATEGIES = 'NOTIFICATION_STRATEGIES';


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationTypes = exports.NotificationStrategy = void 0;
class NotificationStrategy {
}
exports.NotificationStrategy = NotificationStrategy;
var NotificationTypes;
(function (NotificationTypes) {
    NotificationTypes["PUSHOVER"] = "PUSHOVER";
})(NotificationTypes || (exports.NotificationTypes = NotificationTypes = {}));


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationProviders = void 0;
const pushover_strategy_1 = __webpack_require__(21);
exports.NotificationProviders = [pushover_strategy_1.PushoverStrategy];


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var PushoverStrategy_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PushoverStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const notification_strategy_1 = __webpack_require__(19);
const axios_1 = __webpack_require__(22);
const config_1 = __webpack_require__(10);
let PushoverStrategy = PushoverStrategy_1 = class PushoverStrategy {
    constructor(config, http) {
        this.config = config;
        this.http = http;
        this.logger = new common_1.Logger(PushoverStrategy_1.name);
        this.instance = notification_strategy_1.NotificationTypes.PUSHOVER;
    }
    /**
     * Notify
     * @param payload
     */
    notify(payload) {
        const url = this.config.get('PUSHOVER_URL') + '/1/messages.json';
        const token = this.config.get('PUSHOVER_API_KEY');
        const user = this.config.get('PUSHOVER_API_USER');
        this.http
            .post(url, new URLSearchParams({
            token,
            user,
            message: payload.message,
            title: payload.title,
            url: payload.url,
            url_title: payload.urlTitle,
            ttl: payload.ttl.toString(),
        }))
            .subscribe({
            next: (response) => {
                this.logger.log('Notification sent successfully', response.data);
            },
            error: (error) => {
                this.logger.error(error.response.data);
                this.logger.error(error.message);
            },
        });
    }
};
exports.PushoverStrategy = PushoverStrategy;
exports.PushoverStrategy = PushoverStrategy = PushoverStrategy_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _b : Object])
], PushoverStrategy);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const notifications_controller_1 = __webpack_require__(24);
const notification_service_1 = __webpack_require__(16);
const core_1 = __webpack_require__(2);
const cache_manager_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(17);
const strategies_1 = __webpack_require__(18);
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notification_service_1.NotificationService,
            ...strategies_1.NotificationProviders,
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    transform: true,
                }),
            },
            {
                provide: cache_manager_1.Cache,
                useExisting: cache_manager_1.CACHE_MANAGER,
            },
            {
                provide: constants_1.NOTIFICATION_STRATEGIES,
                useFactory: (...providers) => {
                    return new Map(providers.map((p) => [p.instance, p]));
                },
                inject: strategies_1.NotificationProviders,
            },
        ],
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const notification_service_1 = __webpack_require__(16);
const notification_dto_1 = __webpack_require__(25);
let NotificationsController = class NotificationsController {
    constructor(appService) {
        this.appService = appService;
    }
    getData(data) {
        this.appService.sendNotification(data);
        return {
            success: true,
        };
    }
};
exports.NotificationsController = NotificationsController;
tslib_1.__decorate([
    (0, common_1.Post)('notify'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof notification_dto_1.Notification !== "undefined" && notification_dto_1.Notification) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], NotificationsController.prototype, "getData", null);
exports.NotificationsController = NotificationsController = tslib_1.__decorate([
    (0, common_1.Controller)('notifications'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object])
], NotificationsController);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Notification = void 0;
class Notification {
}
exports.Notification = Notification;


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotionModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const notion_controller_1 = __webpack_require__(27);
const notion_service_1 = __webpack_require__(7);
const notion_repository_1 = __webpack_require__(12);
const constants_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let NotionModule = class NotionModule {
};
exports.NotionModule = NotionModule;
exports.NotionModule = NotionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [notion_controller_1.NotionController],
        providers: [
            notion_service_1.NotionService,
            notion_repository_1.NotionRepository,
            {
                provide: constants_1.NOTION_CLIENT,
                useValue: new client_1.Client({
                    auth: process.env.NOTION_TOKEN,
                    logLevel: client_1.LogLevel.ERROR,
                }),
            },
        ],
        exports: [notion_service_1.NotionService],
    })
], NotionModule);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotionController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const notion_service_1 = __webpack_require__(7);
let NotionController = class NotionController {
    constructor(appService) {
        this.appService = appService;
    }
    getPages() {
        return this.appService.getDatabaseItems();
    }
    getNextPage() {
        return this.appService.getNextPage();
    }
};
exports.NotionController = NotionController;
tslib_1.__decorate([
    (0, common_1.Get)('pages'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], NotionController.prototype, "getPages", null);
tslib_1.__decorate([
    (0, common_1.Get)('next'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], NotionController.prototype, "getNextPage", null);
exports.NotionController = NotionController = tslib_1.__decorate([
    (0, common_1.Controller)('notion'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notion_service_1.NotionService !== "undefined" && notion_service_1.NotionService) === "function" ? _a : Object])
], NotionController);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var AppScheduler_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppScheduler = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
const schedule_1 = __webpack_require__(29);
let AppScheduler = AppScheduler_1 = class AppScheduler {
    constructor(appService) {
        this.appService = appService;
        this.logger = new common_1.Logger(AppScheduler_1.name);
    }
    async notify() {
        this.logger.log('Attempting to notify!');
        await this.appService.notifyTask();
    }
};
exports.AppScheduler = AppScheduler;
tslib_1.__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AppScheduler.prototype, "notify", null);
exports.AppScheduler = AppScheduler = AppScheduler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppScheduler);


/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const logger = new common_1.Logger('bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Application is running on: http://localhost:${port}}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map