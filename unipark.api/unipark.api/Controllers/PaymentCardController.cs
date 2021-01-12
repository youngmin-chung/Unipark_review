using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using unipark.api.Data;
using unipark.api.DTOs;
using unipark.api.Models;

namespace unipark.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentCardController : ControllerBase
    {
        private readonly IUniparkRepository _repo;
        private readonly IMapper _mapper;

        public PaymentCardController(IUniparkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET: api/paymentcard/
        [AllowAnonymous]
        [HttpGet(Name = "GetPaymentCard")]
        public async Task<ActionResult> GetPaymentCard()
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _repo.GetUserById(userId);

            var paymentCard = user.PaymentCard;

            var paymentCardToReturn = _mapper.Map<PaymentCardDTO>(paymentCard);

            return Ok(paymentCardToReturn);
        }

        // PUT: api/paymentcard/
        [AllowAnonymous]
        [HttpPut]
        public async Task<ActionResult> UpdatePaymentCard(PaymentCardUpdateDTO paymentCardUpdateDTO)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _repo.GetUserById(userId);

            _mapper.Map(paymentCardUpdateDTO, user.PaymentCard);

            _repo.Update(user);

            // if the repo is saved successfully, return NoContent
            if (await _repo.SaveAll()) return NoContent();
            

            // if the error comes out
            return BadRequest("Failed to update payment card");
        }

        // POST: api/paymentcard
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> CreatePaymentCard(PaymentCardDTO paymentCardDTO)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _repo.GetUserById(userId);

            var paymentCard = _mapper.Map<PaymentCard>(paymentCardDTO);
            paymentCard.CurrencyType = "cad";

            user.PaymentCard = paymentCard;

            _repo.Update(user);

            // if the repo is saved successfully, return NoContent
            if (await _repo.SaveAll())
            {
                var paymentCardToReturn = _mapper.Map<PaymentCardDTO>(paymentCard);
                return Ok(paymentCardToReturn);
            }

            return BadRequest("Could not add the parking lot");
        }

    }
}
