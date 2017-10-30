import React from 'react'
import { Card } from 'ui-utils'

function CardSetTable({slice, maxrows}) {
    return (<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable" style={{display:"inline-block",marginLeft:"1rem",marginRight:"1rem"}}>
	    <thead>
	    <tr>
	    <th className="mdl-data-table__cell--non-numeric">Set Name</th>
	    </tr>
	    </thead>
	    <tbody>
	    {( _ => {
		let rows = slice.map(o => {
		    
		    return (<tr key={o.id}>
			    <td className="mdl-data-table__cell--non-numeric" data-id={o.id}>{o.label}</td>
			    </tr>)
		})
		let j = rows.length;
		while(j < maxrows) {
		    rows.push(<tr key={j + "_blank"}></tr>);
		    j++
		}
		return rows;
	    })()
	    }
	    </tbody>
	    </table>)
}


function partitioncardsets(cardsets, maxrows) {
    let i = 0;
    maxrows = maxrows || 5;
    let tables = [];
    while(i < cardsets.length) {
	let slice = cardsets.slice(i, i+ maxrows);
	tables.push((_ => <CardSetTable slice={slice} maxrows={maxrows} key={"table_" + i}/>)())
	
	i = i + maxrows;
    }

    return tables;
}


function CardSetNameView({cardsets,is_building,clickhandler}) {
    const maxRows = 5;
    if(cardsets) {
	let tables = partitioncardsets(cardsets);
	
	
	return (<div id="cardset-selector">
		{tables}
		{( _ => {
		    if(is_building) {
			return <div className="mdl-spinner mdl-js-spinner is-active"></div>
		    }
		    return (<button className="mdl-button mdl-js-button mdl-button--raised"
			    style={{display:"inline-block",marginLeft:"1rem",marginRight:"1rem"}}
			    onClick={clickhandler}>Update Set View</button>)
		    
		})()
		}
		</div>)
    }
    return null;

}


function CardSetView({cardset_coll,cardset_filter,filter_to_deck,filter_owned,filter_unowned,deck,addhandler,addhandler2,removehandler2}) {
    let cardset = cardset_coll;
    if(cardset_filter) {
	try {
	    let re = new RegExp(cardset_filter);
	    cardset = cardset.filter( card => {
		
		return re.test(card.abilities) || re.test(card.number) || re.test(card.name);
	    });
	}
	catch(e) {
	    console.log(e)
	}
	
    }
    if(filter_to_deck && deck) {
	cardset = cardset.filter( ({id}) => {
	    return deck.filter( ({id:deck_id}) => deck_id === id).length > 0;
	})
    }
    if(filter_owned) {
	cardset = cardset.filter( ( { ownership : { count } } ) => {
	    return count > 0;
	})
    }
    if(filter_unowned) {
	cardset = cardset.filter( ( { ownership : { count } } ) => {
	    return count === 0;
	})
	
    }
    return cardset.map(card => {
	

	let count = card.ownership ? ( card.ownership.count == 0 ? card.ownership.price : card.ownership.count ) : "No Info";
	
	let props = {};
	if(deck) {
	    if(deck.filter( ({id}) => card.id === id).length === 0) {
		props.addhandler = addhandler;
	    }
	}
	return (<div className="mdl-cell mdl-cell--3-col" style={{ maxWidth: "250px" }} key={card.number}>
		<Card {...card} {...props} count={count} addhandler2={addhandler2} removehandler2={removehandler2} menuOpts={[{id:'tcgrepublic',label:'Search TCG Republic'},{id:'tcgplayer',label:'Search TCG Player'},{id:'amazon',label:"Search Amazon"}]} menuHandler={
		    evt => {
			let target = evt.currentTarget.dataset.id;
			if(target === 'tcgrepublic')
			    
			    window.open("https://tcgrepublic.com/product/text_search.html?q=" + encodeURIComponent(card.number));
			else if(target === 'tcgplayer')
			    window.open("https://www.google.com/search?q=" + encodeURIComponent("site:shop.tcgplayer.com \"" + card.number + "\" -\"Price Guide\""))
			else if(target === 'amazon')
			    window.open("https://www.google.com/search?q=" + encodeURIComponent("site:www.amazon.com \"" + card.number + "\""))
		    }
		}>
		{(_ => {
 		    if(card.abilities) {
			let i = 0;
 			return card.abilities.map( text => <p key={"ability_text_" + i++} style={{fontSize:"10px",lineHeight:"12px"}}>{text}</p>)
		    }
		})()}
		</Card>
		</div>)
    })

}

function buildCardSet() {
    return (<div className="mdl-grid">
	    <div className="mdl-cell mdl-cell--6-col">
	    <CardSetNameView {...this.state} clickhandler={this.updateCardView.bind(this)} />
	    
	    </div>
	    <div className="mdl-cell mdl-cell--6-col">
 	    <SearchField value={this.state.cardset_filter} changehandler={this.filterCardSet.bind(this)}/>
	    <Checkbox clickhandler={
		evt => {
		    this.setState({filter_to_deck:evt.currentTarget.checked})
		    
		}
	    } label="Filter On Deck"/>
	    <Checkbox label="Filter Owned" value={this.state.filter_owned} clickhandler={
		evt => {
		    this.setState({filter_owned:evt.currentTarget.checked});
		}
	    }/>
	    <Checkbox label="Filter Unowned" value={this.state.filter_unowned} clickhandler={
		evt => {
		    this.setState({filter_unowned:evt.currentTarget.checked})
		}
	    }/>
	    <button className="mdl-button mdl-js-button mdl-button--raised" onClick={
		evt => {
		    Cards.export_card_list(this.state.cardset_coll.map( ({id}) => id))
			.subscribe( ({url,data}) => {
			    window.open(url + "?keys=" + data);
			})
		    
		}
	    }>Export View</button>

	    </div>
	    
	    {( _ => {
		if(this.state.cardset && this.state.cardset_coll) 
		    return <CardSetView {...this.state} addhandler={this.addCardToDeck.bind(this)} addhandler2={this.updateOwnership.bind(this)} removehandler2={this.removeOwnership.bind(this)}/>;
	    })()}
	    </div>)
}


export { CardSetView, CardSetNameView,  buildCardSet }
