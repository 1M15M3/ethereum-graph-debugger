import React from 'react';
import { connect } from 'react-redux';
import { postContract, postContractAddress } from '../Store/Actions';
import classnames from 'classnames/bind';

import Form from '../Form/Form';

import styles from './Execute.scss';

const cx = classnames.bind(styles);

const mapStateToProps = state => ({
  contracts: state.contracts.contracts,
  contractAddress: state.contracts.contractAddress
})

const mapDispatchToProps = dispatch => ({
  postContract: contract => dispatch(postContract(contract)),
  postContractAddress: (contract, contractAddress) => dispatch(postContractAddress(contract, contractAddress))
});

class Execute extends React.Component {
  constructor(props) {
    super(props);    
  }

  handleInputChange(event) {    
    const { name, value } = event.target; 

    this.setState({
      [name]: value,
    });
  }

  handleKeyDown(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    event.preventDefault();

    if(event.keyCode !== 13) {
      return;
    }

    this.handleSubmit(event);
  }

  handleSubmit(event, item) {    
    const { name, gasPrice, value, gas, contractAddress } = this.state;
    const { contractPath, contractCode, postContract, postContractAddress } = this.props;

    console.log(contracts);
    console.log(contractAddress)
    event.preventDefault();

    if(item.type === 'constructor') {
      postContract({ 
        name, 
        path: contractPath,
        gasPrice,
        value,
        gas,
        source: contractCode 
      });
    } else {
      postContractAddress({
        abi: { constant: item.constant, inputs: [ ...item.inputs ] },
        params: [].concat(name),
        gas: gas ? gas : null,
        gasPrice: gasPrice ? gasPrice : null
      }, contractAddress);
    }
  }


  render() {

    const { executeResponse, contracts } = this.props;

    console.log(contracts)

    const types = item => {
      let type;

      if(item.type === 'constructor') {
        type = 'constructor';
      } else if (item.constant) {
        type = 'constant';
      } else {
        type = 'default';
      }

      return type;
    }

    const inputTypes = [
      { name: 'contractAddress', placeholder: 'Contract Address' },
      { name: 'gas', placeholder: 'Gas' },
      { name: 'value', placeholder: 'Value' },
      { name: 'gasPrice', placeholder: 'Gas Price' }
    ];

    return (
      <div className={styles['execute']}>
        <form
          className={styles['execute__form']}
          onSubmit={(e) => this.handleSubmit(e)}>
          <div className={styles['execute__form__block']}>
            {
              inputTypes.map(type => {
                return (
                  <input 
                      className={styles['execute__form__input']} 
                      name={type.name} 
                      placeholder={type.placeholder}
                      onChange={(e) => this.handleInputChange(e)}
                      onKeyUp={(e) => this.handleKeyUp(e)}
                      onKeyDown={(e) => this.handleKeyDown(e)} 
                    />
                )
              })
            }
          </div>
          {
            executeResponse.map(item => {

              return (
                <div key={`id--${item.name}`} className={cx('execute__form__block', [`execute__form__block--${types(item)}`])}>
                  <input 
                    className={styles['execute__form__input']} 
                    name={item.name} 
                    placeholder={item.inputs.map(input => input.type).join(', ')}
                    onChange={(e) => this.handleInputChange(e)}
                  />
                  <button 
                    className={styles['execute__form__submit']} 
                    onClick={(e) => this.handleSumbit(e, item)}
                    onKeyUp={(e) => this.handleKeyUp(e)}
                    onKeyDown={(e) => this.handleKeyDown(e)} 
                    >
                    <span>{item.type === 'constructor' ? 'constructor' : item.name}</span>
                  </button>
                </div>
              )
            })
          }
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Execute);