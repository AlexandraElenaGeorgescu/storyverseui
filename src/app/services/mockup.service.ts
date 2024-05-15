import { MessageModel } from './../models/message.model';
import { ReviewModel } from './../models/review.model';
import { UserModel } from './../models/user.model';
import { StoryModel } from './../models/story.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MockupService {
    private stories: StoryModel[];
    private reviews: ReviewModel[];
    private getRandomInt = (max: number) => {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    constructor() {
        this.stories = new Array(17);
        this.reviews = new Array(17);
        for(let i=0; i<17; i++) {
            this.stories[i] = new StoryModel();
            this.stories[i].id = 'storyId' + (i+1);
            this.stories[i].name = 'Mockup Story ' + (i+1);
            this.stories[i].startDate = '2019-06-15 02:00';
            this.stories[i].endDate = '2019-06-16 03:30';
            this.stories[i].location = 'London Bridge, London, UK';
            this.stories[i].description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus, dolor facilisis efficitur vestibulum, arcu leo ornare quam, ac imperdiet nisi odio in mauris. Donec euismod nisl sed iaculis volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla ac sapien quis massa suscipit mollis. Mauris magna nisi, dapibus eu quam ut, accumsan lobortis nisi. Proin tincidunt leo est, sed molestie sapien fringilla id. Suspendisse ut neque ligula. Cras at enim maximus, imperdiet enim a, lacinia ligula. Morbi molestie ipsum velit, at varius nunc mollis sed. Ut feugiat tellus vulputate urna lobortis porttitor. Nunc pulvinar at elit vel dapibus. Vivamus a urna laoreet, rhoncus nulla sit amet, lobortis felis. Maecenas non arcu consectetur, consequat tellus vitae, pretium lectus. Maecenas tincidunt tempus semper.Curabitur at vulputate nibh. Aenean eu purus at tellus placerat maximus quis ut nibh. Nam pharetra vulputate urna et laoreet. Donec sodales, dolor vel rutrum placerat, massa dolor elementum nibh, vel pharetra neque erat eu est. Mauris ac dignissim massa. Donec enim mi, pretium ac lacus eu, interdum pretium velit. Sed accumsan maximus elementum. Fusce viverra, ipsum vitae imperdiet gravida, ante enim pretium nunc, eget iaculis nisl velit eu dolor.Phasellus malesuada nec magna et pharetra. Maecenas commodo blandit mi, at porttitor risus vulputate eget. In mattis velit sed neque porttitor, in posuere tellus bibendum. Integer gravida mi quis euismod laoreet. Praesent nibh felis, mollis a ligula vel, hendrerit ultrices sem. Cras lobortis condimentum accumsan. Pellentesque non augue rutrum, laoreet eros id, mattis massa. Praesent pretium pharetra tellus, ac semper ligula placerat vel. Ut pulvinar commodo dui a varius. Praesent ac lacinia quam, ut fermentum est. ';
            this.stories[i].url = 'https://angular.io/';
            this.stories[i].image = 'https://pixabay.com/get/52e6dc474d57ac14f6da8c7dda6d49214b6ac3e45656764f772e7bdc94/night-4694750_1280.jpg';

            this.reviews[i] = new ReviewModel();
            this.reviews[i].userName = ['John','Gregor','Albert','Kant','Bachus'][this.getRandomInt(5)];
            this.reviews[i].lastEdit = '20'+(this.getRandomInt(10)+10)+'-'+(this.getRandomInt(3)+10)+'-'+(this.getRandomInt(18)+10)+' '+(this.getRandomInt(13)+10)+':'+(this.getRandomInt(50)+10);
            this.reviews[i].rating = this.getRandomInt(5) + 1;
            this.reviews[i].opinion = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat urna justo, eu tristique ante volutpat vel. Nam non elementum sem. Ut in erat ac purus sollicitudin fermentum. Fusce non turpis non enim dapibus ullamcorper a at erat. Ut enim leo, placerat id dui at, ultricies egestas nisi. In porttitor, ligula at condimentum vehicula, sem diam elementum odio, et condimentum est mauris eget neque. Quisque porttitor, ipsum nec porta vestibulum, est enim laoreet quam, mollis tempor orci ex sit amet mi. Ut semper, velit suscipit tempor iaculis, est libero vestibulum dolor, et interdum nibh augue elementum odio. Sed fringilla eget.';
        }
    }

    signin<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(url !== 'user/signin')
            return false;

        if(data.email === 'MockupUser@test' && data.password === 'MockupPassword')
            onSuccess(<any>'mockupToken');
        else
            onError(<any>'Wrong credentials');


        return true;
    }

    resetPassword<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('user/send-password/'))
            return false;

        onSuccess(<any>'Cannot use this function in mockup mode');

        return true;
    }

    signup<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(url !== 'user/signup')
            return false;

        onError(<any>'Email used');

        return true;
    }

    createStory<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(url !== 'story/create')
            return false;

        onSuccess(<any>'StoryId');

        return true;
    }

    uploadFile<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(url !== 'story/upload-image')
            return false;

        onSuccess(<any>undefined);

        return true;
    }

    browseStories<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('story/browse/'))
            return false;

        if(url === 'story/browse/6/0')
            onSuccess(<any>this.stories.slice(0, 6));
        else if(url === 'story/browse/6/1')
            onSuccess(<any>this.stories.slice(6, 12));
        else
            onSuccess(<any>this.stories.slice(12));

        return true;
    }

    storyDetails<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('story/details/'))
            return false;

        for(let i=0; i<17; i++) {
            if(this.stories[i].id == url.split('/').reverse()[0]) {
                onSuccess(<any>this.stories[i]);
                break;
            }
        }

        return true;
    }

    getLoggedUser<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(url !== 'user/who-i-am')
            return false;

        let user: UserModel = new UserModel();
        user.email = 'MockupUser@test';
        user.name = 'Mockup';
        user.surname = 'User';

        onSuccess(<any>user);

        return true;
    }

    changePassword<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(url !== 'user/change-password')
            return false;

        onSuccess(<any>undefined);

        return true;
    }

    getRegisteredStories<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('user/registered-stories'))
            return false;

        if(url === 'user/registered-stories/5/0')
            onSuccess(<any>this.stories.slice(0,5));
        else
            onSuccess(<any>this.stories.slice(5,7));

        return true;
    }

    getReviewedStories<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('user/reviewed-stories'))
            return false;

        onSuccess(<any>this.stories.slice(0,4));

        return true;
    }

    getCreatedStories<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('user/created-stories'))
            return false;

        if(url === 'user/created-stories/5/0')
            onSuccess(<any>this.stories.slice(7,12));
        else
            onSuccess(<any>this.stories.slice(12,15));

        return true;
    }

    getRegistrationStatus<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, token: string): boolean {
        if(!url.includes('user/registration-status/'))
            return false;
        
        setTimeout(() => { 
            const id:number = parseInt(url.split('storyId')[1]);
            if(token !== 'mockupToken')
                onError(<any>'Invalid token');
            else if(1<=id && id<=7) {
                onSuccess(<any>'registered');
            } else if(8<=id && id<=15) {
                onSuccess(<any>'creator');
            } else {
                onSuccess(<any>'unregistered');
            }
        }, 500);

        return true;
    }

    userRegister<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(!url.includes('user/register/'))
            return false;
        
        onSuccess(<any>'ok');

        return true;
    }

    userUnregister<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(!url.includes('user/unregister/'))
            return false;
        
        onSuccess(<any>'ok');

        return true;
    }

    getReview<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('review/get/'))
            return false;
        
        const review: ReviewModel = new ReviewModel();
        const emptyReview: ReviewModel = new ReviewModel();
        review.rating = 3;
        review.opinion = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat urna justo, eu tristique ante volutpat vel. Nam non elementum sem. Ut in erat ac purus sollicitudin fermentum. Fusce non turpis non enim dapibus ullamcorper a at erat. Ut enim leo, placerat id dui at, ultricies egestas nisi. In porttitor, ligula at condimentum vehicula, sem diam elementum odio, et condimentum est mauris eget neque. Quisque porttitor, ipsum nec porta vestibulum, est enim laoreet quam, mollis tempor orci ex sit amet mi. Ut semper, velit suscipit tempor iaculis, est libero vestibulum dolor, et interdum nibh augue elementum odio. Sed fringilla eget.';

        setTimeout(() => { 
            const id:number = parseInt(url.split('storyId')[1]);
            if(1<=id && id<=4) {
                onSuccess(<any>review);
            } else {
                onSuccess(<any>emptyReview);
            }
        }, 500);


        return true;
    }

    editReview<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any): boolean {
        if(!url.includes('review/edit/'))
            return false;

        onSuccess(<any>'ok');


        return true;
    }

    deleteReview<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('review/delete/'))
            return false;

        onSuccess(<any>'ok');


        return true;
    }

    browseReviews<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('review/browse/'))
            return false;

        const pageId: number = parseInt(url.split('/').reverse()[0]);

        if(pageId === 0)
            onSuccess(<any>this.reviews.slice(0,6));
        else if(pageId === 1)
            onSuccess(<any>this.reviews.slice(6,12));
        else
            onSuccess(<any>this.reviews.slice(12));

        return true;
    }

    getChatMessages<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('story/chat-messages/'))
            return false;

        const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ultrices nisi. Sed consectetur odio ut sem porttitor semper. In tincidunt est sit amet sagittis faucibus. Nam est nibh, porta vitae molestie euismod, facilisis in lorem. In pretium mi et pretium ultrices. Donec eleifend, sapien non ultrices rhoncus, erat lorem ultrices dolor, in cursus dolor purus in metus. Maecenas vitae tortor nec mauris viverra luctus. In scelerisque dui sed imperdiet elementum. Proin pulvinar erat id rhoncus ullamcorper. Integer ac leo id mauris tempus semper ac dictum neque. Aliquam molestie, orci id maximus porttitor, metus ex fermentum nibh, vel sagittis ante arcu nec massa. Nulla maximus sed lorem et congue. Proin consectetur suscipit imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse faucibus lectus pharetra mauris scelerisque, vel pellentesque nulla sodales. Cras cursus urna lorem, nec euismod enim pretium ut. Vestibulum fringilla odio sit amet urna lobortis ornare. Etiam tristique eget metus eu luctus. Suspendisse lacus dui, vestibulum eget neque ut, laoreet volutpat magna. Aliquam erat volutpat. Aliquam tristique porttitor lorem, sit amet tincidunt est pellentesque eget. Duis quis ex urna. Mauris elementum est dolor, eu tincidunt purus scelerisque et. Praesent in leo tristique, aliquam lectus et, scelerisque tortor. Pellentesque luctus eu orci id cursus. Donec non odio vitae dolor lacinia sagittis id eget nulla. Integer tempus dolor placerat urna semper, eget rhoncus nunc pulvinar. In eget erat risus. Fusce urna magna, interdum at pretium ac, mollis nec magna. Sed non interdum neque. Curabitur in libero quis ex suscipit facilisis. Phasellus malesuada arcu non nibh vestibulum luctus. Sed laoreet id leo pellentesque laoreet. Sed id lectus semper, ultrices diam et, molestie felis. Curabitur mattis, eros eu auctor pulvinar, odio odio vulputate sem, a consequat tortor libero ut elit. Mauris eget hendrerit est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam nec leo vestibulum, consectetur ipsum quis, hendrerit massa. Proin faucibus nisi eget diam dapibus, a dignissim risus vestibulum. Curabitur nec libero sed ante aliquam rhoncus. Mauris consequat tellus in varius tempor. Cras et fermentum metus, id eleifend nisl. Praesent bibendum ante nibh, sed congue lacus viverra et. Nulla tincidunt massa vitae purus mattis sollicitudin. Phasellus sed ipsum a enim consequat viverra. Cras id sagittis lacus. Nulla efficitur, leo vel molestie viverra, turpis urna fringilla enim, id maximus erat neque in metus. Proin eu sollicitudin sem. Phasellus at condimentum tellus. Nunc tristique sit amet diam sed semper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed nec dui sed erat interdum euismod. Nam accumsan turpis sed ex ornare, in vehicula orci auctor. Quisque luctus libero nulla. Vivamus quis sapien felis. Ut rutrum euismod facilisis. Morbi viverra mattis tellus. Morbi et mi egestas, blandit sem nec, rhoncus mauris. Sed eget hendrerit justo. Mauris et interdum erat. Aliquam venenatis mauris nisl, volutpat dignissim ex laoreet sit amet. Suspendisse pellentesque quam ex, ut convallis risus gravida non. Pellentesque et gravida nulla, a mollis velit. Nunc ullamcorper magna a pharetra cursus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Aliquam ut accumsan quam. Proin tortor quam, bibendum vitae metus nec, ullamcorper blandit urna. Maecenas justo velit, rutrum non nunc ut, faucibus pulvinar mauris. Nunc lectus sem, posuere ut eros id, tristique laoreet sapien. Suspendisse feugiat, lorem venenatis mollis egestas, elit felis blandit nulla, non facilisis urna augue vitae massa. Maecenas gravida ex lectus, ut efficitur arcu scelerisque eu. Nunc faucibus cursus arcu id auctor. Vestibulum ac eros et metus aliquet dictum. Donec imperdiet feugiat ipsum. In ultrices odio eu nisi luctus, eu rutrum mi blandit. Donec consequat quam urna, sed porttitor quam aliquet vitae. Sed pretium lacinia ipsum sit amet accumsan. Mauris eu vestibulum eros. Integer sodales sit amet urna eu iaculis. Suspendisse eget orci tellus. Aliquam erat volutpat. Sed a tincidunt neque. Integer at orci hendrerit, eleifend eros in, congue metus. Curabitur placerat metus et leo commodo condimentum. Quisque sed felis elit. Praesent eget ultrices ex, vel pretium purus. In hac habitasse platea dictumst. Duis ipsum turpis, pretium in massa ut, egestas consectetur tortor. Vivamus venenatis bibendum ante, in vulputate nisi varius tempor. Donec ex felis, vulputate ut lorem vitae, tristique tempus neque. In non nulla fringilla libero auctor tincidunt at in tortor. Proin vestibulum quam nibh, nec posuere enim ornare a. Pellentesque eu eleifend erat, at hendrerit orci. Curabitur magna sapien, hendrerit quis magna eu, commodo placerat turpis. Vivamus commodo ante quis metus sollicitudin ultricies finibus eu lectus. Morbi tempor condimentum purus ac molestie. Aenean efficitur bibendum tortor, vel interdum mi fermentum a. Sed posuere, justo ut feugiat venenatis, lorem nisi congue ante, sit amet pretium eros nulla eu risus. Sed consectetur facilisis odio viverra gravida. Nullam pellentesque orci interdum elit auctor, a efficitur ante facilisis. Donec eu magna porta eros semper fermentum quis eu turpis. Nunc vehicula, mi nec suscipit malesuada, arcu neque vestibulum nulla, id ullamcorper orci turpis eget neque. Curabitur eget pharetra urna, nec pharetra augue. Donec pulvinar sapien vel felis faucibus cursus. Nunc vitae turpis elit. Nam ultricies lobortis fringilla. Duis risus velit, sodales et varius vel, faucibus ut magna. Curabitur lacinia congue ex, in laoreet ipsum pellentesque nec. Fusce pulvinar ipsum a ligula facilisis ullamcorper at at eros. Sed at lobortis risus, a tincidunt sapien. Ut et augue tincidunt, rutrum risus sed, vulputate orci. Nam id molestie eros, sit amet facilisis magna. Donec eget mi tincidunt, pellentesque eros ac, efficitur ante. Donec eget egestas arcu. Proin at sodales libero, sed rhoncus lectus. Proin dapibus purus vitae scelerisque molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce ultrices lorem felis, non blandit felis rutrum vitae. Donec tristique nulla vitae est lobortis consequat. Nam interdum, turpis vitae scelerisque lobortis, nisi est dignissim mauris, quis molestie sem lacus ut tellus. Duis vel tincidunt est. Donec sollicitudin dictum quam, sed luctus felis accumsan vel. Mauris vel pharetra dolor, eget efficitur metus. Mauris bibendum ut ante eu tempus. Quisque ac dictum massa. Vestibulum quam quam, tincidunt eget efficitur et, placerat nec turpis. In.';
        const loremWords = lorem.split(' ');
        const msgs: MessageModel[] = new Array(50);
        let msgSize;
        for(let i=0; i<50; i++) {
            msgSize = this.getRandomInt(20);
            msgs[i] = new MessageModel();
            msgs[i].userName = ['', 'John','Gregor', '', 'Albert','Kant','Bachus', ''][this.getRandomInt(8)];
            msgs[i].dateSent = '20'+(this.getRandomInt(10)+10)+'-'+(this.getRandomInt(3)+10)+'-'+(this.getRandomInt(18)+10)+' '+(this.getRandomInt(13)+10)+':'+(this.getRandomInt(50)+10);
            msgs[i].message = loremWords[this.getRandomInt(loremWords.length)]
            for(let j=0; j<msgSize; j++)
                msgs[i].message += ' ' + loremWords[this.getRandomInt(loremWords.length)]
        }

        onSuccess(<any>msgs);

        return true;
    }    

    getReviewsStats<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('story/reviews-stats/'))
            return false;

        setTimeout(() => { 
            onSuccess(<any>{ 
                item1: this.getRandomInt(50) + 50, 
                item2: this.getRandomInt(500) / 100 
            });
        }, 500);

        return true;
    }

    getLineChartStats<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('story/line-chart/'))
            return false;

        setTimeout(() => { 
            let nrReviews = [];
            for(let i=0; i<10; i++)
                nrReviews.push(this.getRandomInt(50));
    
            onSuccess(<any>{ 
                item1: nrReviews, 
                item2: ['2019-01-01', '2019-12-31', 10]
            });
        }, 500);

        return true;
    }

    getPieChartStats<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void): boolean {
        if(!url.includes('story/pie-chart/'))
            return false;

        setTimeout(() => { 
            onSuccess(<any>[this.getRandomInt(5)+1,this.getRandomInt(5)+1,this.getRandomInt(5)+1]);
        }, 500);

        return true;
    }
}
