'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">rvm-mobile documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AboutPageModule.html" data-type="entity-link">AboutPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AboutPageModule-b1e2201a54e1a1b6992aaa4fa15de495"' : 'data-target="#xs-components-links-module-AboutPageModule-b1e2201a54e1a1b6992aaa4fa15de495"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AboutPageModule-b1e2201a54e1a1b6992aaa4fa15de495"' :
                                            'id="xs-components-links-module-AboutPageModule-b1e2201a54e1a1b6992aaa4fa15de495"' }>
                                            <li class="link">
                                                <a href="components/AboutPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AboutPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-6f719d84017f14e233869379e8935cea"' : 'data-target="#xs-components-links-module-AppModule-6f719d84017f14e233869379e8935cea"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6f719d84017f14e233869379e8935cea"' :
                                            'id="xs-components-links-module-AppModule-6f719d84017f14e233869379e8935cea"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-1724e1b73e53917f818f0b9cd4dc8b2d"' : 'data-target="#xs-injectables-links-module-CoreModule-1724e1b73e53917f818f0b9cd4dc8b2d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-1724e1b73e53917f818f0b9cd4dc8b2d"' :
                                        'id="xs-injectables-links-module-CoreModule-1724e1b73e53917f818f0b9cd4dc8b2d"' }>
                                        <li class="link">
                                            <a href="injectables/AllocationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AllocationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CourseService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CourseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ErrorMessageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ErrorMessageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStorageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStorageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocationsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocationsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrganisationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>OrganisationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VolunteerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>VolunteerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link">HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomePageModule-e6d50a0eca31ecdfbf8efca6df1ee326"' : 'data-target="#xs-components-links-module-HomePageModule-e6d50a0eca31ecdfbf8efca6df1ee326"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-e6d50a0eca31ecdfbf8efca6df1ee326"' :
                                            'id="xs-components-links-module-HomePageModule-e6d50a0eca31ecdfbf8efca6df1ee326"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link">LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginPageModule-df5c29376464b6e3aa12607c731b3d31"' : 'data-target="#xs-components-links-module-LoginPageModule-df5c29376464b6e3aa12607c731b3d31"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-df5c29376464b6e3aa12607c731b3d31"' :
                                            'id="xs-components-links-module-LoginPageModule-df5c29376464b6e3aa12607c731b3d31"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LogoutPageModule.html" data-type="entity-link">LogoutPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LogoutPageModule-ae2f533e53373691d38c65446e0809d6"' : 'data-target="#xs-components-links-module-LogoutPageModule-ae2f533e53373691d38c65446e0809d6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LogoutPageModule-ae2f533e53373691d38c65446e0809d6"' :
                                            'id="xs-components-links-module-LogoutPageModule-ae2f533e53373691d38c65446e0809d6"' }>
                                            <li class="link">
                                                <a href="components/LogoutPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoutPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VolunteerPageModule.html" data-type="entity-link">VolunteerPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-VolunteerPageModule-04ea5b99764b6626c1d11f29c2cb4b10"' : 'data-target="#xs-components-links-module-VolunteerPageModule-04ea5b99764b6626c1d11f29c2cb4b10"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VolunteerPageModule-04ea5b99764b6626c1d11f29c2cb4b10"' :
                                            'id="xs-components-links-module-VolunteerPageModule-04ea5b99764b6626c1d11f29c2cb4b10"' }>
                                            <li class="link">
                                                <a href="components/AddVolunteerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddVolunteerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListVolunteerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListVolunteerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SendMessageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SendMessageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ValidateVolunteerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateVolunteerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VolunteerPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VolunteerPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Allocation.html" data-type="entity-link">Allocation</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Course.html" data-type="entity-link">Course</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseSyncService.html" data-type="entity-link">DatabaseSyncService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Organisation.html" data-type="entity-link">Organisation</a>
                            </li>
                            <li class="link">
                                <a href="classes/RouteReusableStrategy.html" data-type="entity-link">RouteReusableStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/Volunteer.html" data-type="entity-link">Volunteer</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AllocationService.html" data-type="entity-link">AllocationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link">AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CourseService.html" data-type="entity-link">CourseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorMessageService.html" data-type="entity-link">ErrorMessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStorageService.html" data-type="entity-link">LocalStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocationsService.html" data-type="entity-link">LocationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganisationService.html" data-type="entity-link">OrganisationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VolunteerService.html" data-type="entity-link">VolunteerService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/ErrorHandlerInterceptor.html" data-type="entity-link">ErrorHandlerInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/RequestInterceptor.html" data-type="entity-link">RequestInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link">AuthenticationGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/UnauthenticatedGuard.html" data-type="entity-link">UnauthenticatedGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Credentials.html" data-type="entity-link">Credentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorMessageObject.html" data-type="entity-link">ErrorMessageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginPayload.html" data-type="entity-link">LoginPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RootObject.html" data-type="entity-link">RootObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});